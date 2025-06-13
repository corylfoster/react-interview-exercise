import React, { useEffect, useState } from "react";
import { Center, Heading, ScaleFade, Stack, VStack } from "@chakra-ui/react";
import { Card } from "@components/design/Card";
import DistrictSearchCard from "./DistrictSearchCard";
import SchoolSearchCard from "./SchoolSearchCard";
import SelectedDetailsCard from "./SelectedDetailsCard";
import { useDeselectIfFilteredOut } from "@utils/hooks";
import {
  searchSchoolDistricts,
  searchSchools,
  NCESDistrictFeatureAttributes,
  NCESSchoolFeatureAttributes,
} from "@utils/nces";

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

  const filteredSchools = selectedDistrict
    ? schools.filter((s) => s.LEAID === selectedDistrict)
    : schools;

  useDeselectIfFilteredOut(selectedSchool, filteredSchools, setSelectedSchool);

  useEffect(() => {
    const fetchDistricts = async () => {
      if (!triggerDistrictSearch || districtQuery.trim() === "") return;

      setSearching(true);
      setDistrictSearchAttempted(true);

      try {
        const results = await searchSchoolDistricts(districtQuery);
        setDistricts(results);
        setSelectedDistrict(undefined);
        setSchools([]);
        setSelectedSchool(null);
      } finally {
        setSearching(false);
        setTriggerDistrictSearch(false);
      }
    };

    fetchDistricts();
  }, [triggerDistrictSearch, districtQuery]);

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
    <Center padding="100px 20px">
      <ScaleFade initialScale={0.9} in={true}>
        <VStack spacing={6} width="100%" align="center">
          <Card variant="rounded" bg="white">
            <Heading as="h1" textAlign="center">
              School Data Finder
            </Heading>

            <Stack
              direction={{ base: "column", md: "row" }} // VStack on small screens, HStack on medium+
              spacing={6}
              width="100%"
            >
              <VStack spacing={6} flex="1" maxW={{ base: "100%", md: "48%" }}>
                <DistrictSearchCard
                  districtQuery={districtQuery}
                  setDistrictQuery={setDistrictQuery}
                  triggerDistrictSearch={() => setTriggerDistrictSearch(true)}
                  searching={searching}
                  districts={districts}
                  districtSearchAttempted={districtSearchAttempted}
                  selectedDistrict={selectedDistrict}
                  setSelectedDistrict={setSelectedDistrict}
                />
                <SchoolSearchCard
                  schoolQuery={schoolQuery}
                  setSchoolQuery={setSchoolQuery}
                  triggerSchoolSearch={() => setTriggerSchoolSearch(true)}
                  searching={searching}
                  filteredSchools={filteredSchools}
                  schoolSearchAttempted={schoolSearchAttempted}
                  selectedSchool={selectedSchool}
                  setSelectedSchool={setSelectedSchool}
                />
              </VStack>
              <SelectedDetailsCard
                selectedDistrictObj={selectedDistrictObj}
                selectedSchool={selectedSchool}
                flex="1"
                width="100%"
                maxW={{ base: "100%", md: "48%" }}
              />
            </Stack>
          </Card>
        </VStack>
      </ScaleFade>
    </Center>
  );
};

export default Home;
