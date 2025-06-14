import React from "react";
import {
  Heading,
  Input,
  Button,
  Text,
  Box,
  HStack,
  Checkbox,
  VStack,
} from "@chakra-ui/react";
import { Card } from "@components/design/Card";
import { NCESSchoolFeatureAttributes } from "@utils/nces";

// Props interface for the SchoolSearchCard component
interface SchoolSearchCardProps {
  schoolQuery: string; // The current search query for schools
  setSchoolQuery: (query: string) => void; // Function to update the school search query
  triggerSchoolSearch: () => void; // Function to trigger a school search
  searching: boolean; // Indicates whether a search is currently in progress
  filteredSchools: NCESSchoolFeatureAttributes[]; // List of schools filtered by the selected district
  schoolSearchAttempted: boolean; // Indicates whether a school search has been attempted
  selectedSchool: NCESSchoolFeatureAttributes | null; // The currently selected school
  setSelectedSchool: (school: NCESSchoolFeatureAttributes | null) => void; // Function to update the selected school
}

// Component for searching and selecting schools
const SchoolSearchCard: React.FC<SchoolSearchCardProps> = ({
  schoolQuery,
  setSchoolQuery,
  triggerSchoolSearch,
  searching,
  filteredSchools,
  schoolSearchAttempted,
  selectedSchool,
  setSelectedSchool,
}) => {
  return (
    <Card
      variant="rounded"
      bg="brand.darkGreen"
      borderColor="brand.darkGreen"
      flex="1"
      width="100%"
    >
      {/* Heading for the school search card */}
      <Heading color="white" size="md" mb={2}>
        Search for a School
      </Heading>

      {/* Input field for entering the school search query */}
      <Input
        placeholder="Enter school name"
        value={schoolQuery}
        onChange={(e) => setSchoolQuery(e.target.value)}
      />

      {/* Button to trigger the school search */}
      <Button
        variant="redButton"
        onClick={triggerSchoolSearch}
        isLoading={searching} // Show a loading spinner if a search is in progress
        mt={2}
      >
        Search Schools
      </Button>

      {/* Message displayed if no schools are found after a search */}
      {schoolSearchAttempted && !searching && filteredSchools.length === 0 && (
        <Text mt={4} color="red.500">
          No schools found matching your search.
        </Text>
      )}

      {/* List of schools returned from the search */}
      {filteredSchools.map((s, i) => {
        const isSelected = selectedSchool?.NCESSCH === s.NCESSCH; // Check if the school is currently selected
        return (
          <Box
            key={i} // Unique key for each school
            p={2}
            borderWidth="1px"
            borderRadius="md"
            mt={2}
            bg={isSelected ? "blue.50" : "white"} // Highlight the selected school
            cursor="pointer"
            onClick={() => setSelectedSchool(isSelected ? null : s)} // Toggle selection
            width="100%"
          >
            <HStack>
              {/* Checkbox to indicate the selected school */}
              <Checkbox isChecked={isSelected} pointerEvents="none" />
              <VStack align="start" spacing={0}>
                {/* Display the school name */}
                <Text fontWeight="bold">{s.NAME}</Text>
                {/* Display the school's address */}
                <Text fontSize="sm">
                  {s.STREET}, {s.CITY}, {s.STATE} {s.ZIP}
                </Text>
              </VStack>
            </HStack>
          </Box>
        );
      })}
    </Card>
  );
};

export default SchoolSearchCard;
