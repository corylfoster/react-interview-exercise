import React, { useEffect, useState } from "react";
import {
  Button,
  Center,
  Heading,
  Text,
  OrderedList,
  ListItem,
  ScaleFade,
  Spinner,
  Checkbox,
  Input,
  HStack,
  VStack,
  Box,
} from "@chakra-ui/react";
import { Card } from "@components/design/Card";
import {
  searchSchoolDistricts,
  searchSchools,
  NCESDistrictFeatureAttributes,
  NCESSchoolFeatureAttributes,
} from "@utils/nces";

const googleMapsKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// Custom hook to deselect a school if it’s no longer in the filtered list
const useDeselectIfFilteredOut = (
  selectedSchool: NCESSchoolFeatureAttributes | null,
  filteredSchools: NCESSchoolFeatureAttributes[],
  setSelectedSchool: React.Dispatch<
    React.SetStateAction<NCESSchoolFeatureAttributes | null>
  >
) => {
  useEffect(() => {
    if (
      selectedSchool &&
      !filteredSchools.some((s) => s.NCESSCH === selectedSchool.NCESSCH)
    ) {
      setSelectedSchool(null);
    }
  }, [filteredSchools, selectedSchool, setSelectedSchool]);
};

const Home: React.FC = () => {
  const [districtQuery, setDistrictQuery] = useState("");
  const [triggerDistrictSearch, setTriggerDistrictSearch] = useState(false);

  const [schoolQuery, setSchoolQuery] = useState("");
  const [triggerSchoolSearch, setTriggerSchoolSearch] = useState(false);

  const [searching, setSearching] = useState(false);

  const [districtSearchAttempted, setDistrictSearchAttempted] = useState(false);
  const [schoolSearchAttempted, setSchoolSearchAttempted] = useState(false);

  const [schools, setSchools] = useState<NCESSchoolFeatureAttributes[]>([]);
  const [selectedSchool, setSelectedSchool] =
    useState<NCESSchoolFeatureAttributes | null>(null);

  const [districts, setDistricts] = useState<NCESDistrictFeatureAttributes[]>(
    []
  );
  const [selectedDistrict, setSelectedDistrict] = useState<string | undefined>(
    undefined
  );

  // Derived filtered schools
  const filteredSchools = selectedDistrict
    ? schools.filter((s) => s.LEAID === selectedDistrict)
    : schools;

  // Use the deselection hook
  useDeselectIfFilteredOut(selectedSchool, filteredSchools, setSelectedSchool);

  // District search useEffect
  useEffect(() => {
    const fetchDistricts = async () => {
      if (!triggerDistrictSearch || districtQuery.trim() === "") return;

      setSearching(true);
      setDistrictSearchAttempted(true);

      try {
        const results = await searchSchoolDistricts(districtQuery);
        setDistricts(results);
        setSelectedDistrict(undefined);
        setSchools([]); // clear previous school results
        setSelectedSchool(null);
      } finally {
        setSearching(false);
        setTriggerDistrictSearch(false);
      }
    };

    fetchDistricts();
  }, [triggerDistrictSearch, districtQuery]);

  // School search useEffect
  useEffect(() => {
    const fetchSchools = async () => {
      if (!triggerSchoolSearch || schoolQuery.trim() === "") return;

      setSearching(true);
      setSchoolSearchAttempted(true);

      try {
        const results = await searchSchools(schoolQuery, selectedDistrict);
        setSchools(results);
        setSelectedSchool(null);
      } finally {
        setSearching(false);
        setTriggerSchoolSearch(false);
      }
    };

    fetchSchools();
  }, [triggerSchoolSearch, schoolQuery, selectedDistrict]);

  const selectedDistrictObj = districts.find(
    (d) => d.LEAID === selectedDistrict
  );

  return (
    <Center padding="100px">
      <ScaleFade initialScale={0.9} in={true}>
        <VStack spacing={6} width="100%" maxW="1000px" align="stretch">
          <Card variant="rounded" borderColor="blue">
            <Heading>School Data Finder</Heading>
            <Text>
              Build an interface that allows:
              <OrderedList pl={5} mt={2}>
                <ListItem>Search for a district</ListItem>
                <ListItem>
                  Search for a school (with or without district)
                </ListItem>
                <ListItem>View the data in an organized way</ListItem>
              </OrderedList>
            </Text>
          </Card>

          <HStack align="start" spacing={6} width="100%">
            <VStack spacing={6} flex="1" maxW="48%">
              {/* District Search Card */}
              <Card variant="rounded" width="100%">
                <Heading size="md" mb={2}>
                  1. Search for a District
                </Heading>
                <Input
                  placeholder="Enter district name"
                  value={districtQuery}
                  onChange={(e) => setDistrictQuery(e.target.value)}
                />
                <Button
                  onClick={() => setTriggerDistrictSearch(true)}
                  isLoading={searching}
                  mt={2}
                >
                  Search Districts
                </Button>

                {districtSearchAttempted &&
                  !searching &&
                  districts.length === 0 && (
                    <Text mt={4} color="red.500">
                      No districts found matching your search.
                    </Text>
                  )}

                {districts.length > 0 && (
                  <Text mt={4} fontStyle="italic" color="gray.600">
                    Please choose a district, then search for a school
                  </Text>
                )}

                {districts.map((d) => (
                  <Box
                    key={d.LEAID}
                    p={2}
                    borderWidth="1px"
                    borderRadius="md"
                    mt={2}
                    bg={
                      selectedDistrict === d.LEAID ? "blue.50" : "transparent"
                    }
                    cursor="pointer"
                    width="100%"
                    onClick={() =>
                      setSelectedDistrict(
                        selectedDistrict === d.LEAID ? undefined : d.LEAID
                      )
                    }
                  >
                    <HStack>
                      <Checkbox
                        isChecked={selectedDistrict === d.LEAID}
                        pointerEvents="none"
                        mr={3}
                      />
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="bold">{d.NAME}</Text>
                        <Text fontSize="sm">
                          {d.LCITY}, {d.LSTATE} {d.LZIP}
                        </Text>
                      </VStack>
                    </HStack>
                  </Box>
                ))}
              </Card>

              {/* School Search Card */}
              <Card variant="rounded">
                <Heading size="md" mb={2}>
                  2. Search for a School
                </Heading>
                <Input
                  placeholder="Enter school name"
                  value={schoolQuery}
                  onChange={(e) => setSchoolQuery(e.target.value)}
                />
                <Button
                  onClick={() => setTriggerSchoolSearch(true)}
                  isLoading={searching}
                  mt={2}
                >
                  Search Schools
                </Button>

                {schoolSearchAttempted &&
                  !searching &&
                  filteredSchools.length === 0 && (
                    <Text mt={4} color="red.500">
                      No schools found matching your search.
                    </Text>
                  )}

                {filteredSchools.map((s, i) => {
                  const isSelected = selectedSchool?.NCESSCH === s.NCESSCH;
                  return (
                    <Box
                      key={i}
                      p={2}
                      borderWidth="1px"
                      borderRadius="md"
                      mt={2}
                      bg={isSelected ? "blue.50" : "transparent"}
                      cursor="pointer"
                      onClick={() => setSelectedSchool(isSelected ? null : s)}
                      width="100%"
                    >
                      <HStack>
                        <Checkbox isChecked={isSelected} pointerEvents="none" />
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="bold">{s.NAME}</Text>
                          <Text fontSize="sm">
                            {s.STREET}, {s.CITY}, {s.STATE} {s.ZIP}
                          </Text>
                        </VStack>
                      </HStack>
                    </Box>
                  );
                })}
              </Card>
            </VStack>

            {/* Selected Details */}
            <Card variant="rounded">
              <Heading size="md" mb={2}>
                Selected Details
              </Heading>

              {!selectedDistrictObj && !selectedSchool ? (
                <Text color="gray.500" fontStyle="italic">
                  Please choose a district or a school to see results.
                </Text>
              ) : (
                <VStack align="start" spacing={6}>
                  {selectedDistrictObj && (
                    <Box>
                      <Heading size="sm" mb={2}>
                        District Details
                      </Heading>
                      <Text fontWeight="bold">{selectedDistrictObj.NAME}</Text>
                      <Text>
                        {selectedDistrictObj.LCITY},{" "}
                        {selectedDistrictObj.LSTATE} {selectedDistrictObj.LZIP}
                      </Text>
                    </Box>
                  )}

                  {selectedSchool && (
                    <Box>
                      <Heading size="sm" mb={2}>
                        School Details
                      </Heading>
                      <Text fontWeight="bold">{selectedSchool.NAME}</Text>
                      <Text>
                        {selectedSchool.STREET}, {selectedSchool.CITY},{" "}
                        {selectedSchool.STATE} {selectedSchool.ZIP}
                      </Text>
                      <Box
                        as="iframe"
                        width="100%"
                        height="300"
                        border="0"
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        src={`https://www.google.com/maps/embed/v1/place?key=${googleMapsKey}&q=${encodeURIComponent(
                          `${selectedSchool.NAME}, ${selectedSchool.STREET}, ${selectedSchool.CITY}, ${selectedSchool.STATE} ${selectedSchool.ZIP}`
                        )}`}
                      />
                    </Box>
                  )}
                </VStack>
              )}
            </Card>
          </HStack>
        </VStack>
      </ScaleFade>
    </Center>
  );
};

export default Home;
