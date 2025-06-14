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
  // State for managing the district search query and triggering the search
  const [districtQuery, setDistrictQuery] = useState("");
  const [triggerDistrictSearch, setTriggerDistrictSearch] = useState(false);

  // State for managing the school search query and triggering the search
  const [schoolQuery, setSchoolQuery] = useState("");
  const [triggerSchoolSearch, setTriggerSchoolSearch] = useState(false);

  // State for tracking whether a search is currently in progress
  const [searching, setSearching] = useState(false);

  // State for tracking whether a search has been attempted
  const [districtSearchAttempted, setDistrictSearchAttempted] = useState(false);
  const [schoolSearchAttempted, setSchoolSearchAttempted] = useState(false);

  // State for storing the list of schools and the currently selected school
  const [schools, setSchools] = useState<NCESSchoolFeatureAttributes[]>([]);
  const [selectedSchool, setSelectedSchool] =
    useState<NCESSchoolFeatureAttributes | null>(null);

  // State for storing the list of districts and the currently selected district
  const [districts, setDistricts] = useState<NCESDistrictFeatureAttributes[]>(
    []
  );
  const [selectedDistrict, setSelectedDistrict] = useState<string | undefined>(
    undefined
  );

  // Filter the list of schools based on the selected district
  const filteredSchools = selectedDistrict
    ? schools.filter((s) => s.LEAID === selectedDistrict)
    : schools;

  // Custom hook to deselect the selected school if it is filtered out
  useDeselectIfFilteredOut(selectedSchool, filteredSchools, setSelectedSchool);

  // Effect to fetch districts when a district search is triggered
  useEffect(() => {
    const fetchDistricts = async () => {
      // Do nothing if the search is not triggered or the query is empty
      if (!triggerDistrictSearch || districtQuery.trim() === "") return;

      setSearching(true); // Indicate that a search is in progress
      setDistrictSearchAttempted(true); // Mark that a district search has been attempted

      try {
        // Fetch districts based on the query
        const results = await searchSchoolDistricts(districtQuery);
        setDistricts(results); // Update the list of districts
        setSelectedDistrict(undefined); // Reset the selected district
        setSchools([]); // Clear the list of schools
        setSelectedSchool(null); // Clear the selected school
      } finally {
        setSearching(false); // Mark the search as complete
        setTriggerDistrictSearch(false); // Reset the trigger
      }
    };

    fetchDistricts();
  }, [triggerDistrictSearch, districtQuery]);

  // Effect to fetch schools when a school search is triggered
  useEffect(() => {
    const fetchSchools = async () => {
      // Do nothing if the search is not triggered or the query is empty
      if (!triggerSchoolSearch || schoolQuery.trim() === "") return;

      setSearching(true); // Indicate that a search is in progress
      setSchoolSearchAttempted(true); // Mark that a school search has been attempted

      try {
        // Fetch schools based on the query and selected district
        const results = await searchSchools(schoolQuery, selectedDistrict);
        setSchools(results); // Update the list of schools
        setSelectedSchool(null); // Clear the selected school
      } finally {
        setSearching(false); // Mark the search as complete
        setTriggerSchoolSearch(false); // Reset the trigger
      }
    };

    fetchSchools();
  }, [triggerSchoolSearch, schoolQuery, selectedDistrict]);

  // Find the selected district object based on the selected district ID
  const selectedDistrictObj = districts.find(
    (d) => d.LEAID === selectedDistrict
  );

  return (
    <Center padding="100px 20px">
      {/* Add a scaling and fading animation to the content */}
      <ScaleFade initialScale={0.9} in={true}>
        <VStack spacing={6} width="100%" align="center">
          {/* Main card containing the application content */}
          <Card variant="rounded" bg="white">
            <Heading as="h1" textAlign="center" mb={4}>
              School Data Finder
            </Heading>

            {/* Layout for the search cards and selected details */}
            <Stack
              direction={{ base: "column", md: "row" }} // Vertical on small screens, horizontal on medium+
              spacing={6}
              width="100%"
            >
              {/* Left column: District and school search cards */}
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

              {/* Right column: Selected details card */}
              <SelectedDetailsCard
                selectedDistrictObj={selectedDistrictObj}
                selectedSchool={selectedSchool}
              />
            </Stack>
          </Card>
        </VStack>
      </ScaleFade>
    </Center>
  );
};

export default Home;
