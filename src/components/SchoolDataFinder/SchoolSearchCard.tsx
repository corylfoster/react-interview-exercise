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

interface SchoolSearchCardProps {
  schoolQuery: string;
  setSchoolQuery: (query: string) => void;
  triggerSchoolSearch: () => void;
  searching: boolean;
  filteredSchools: NCESSchoolFeatureAttributes[];
  schoolSearchAttempted: boolean;
  selectedSchool: NCESSchoolFeatureAttributes | null;
  setSelectedSchool: (school: NCESSchoolFeatureAttributes | null) => void;
}

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
      <Heading color="white" size="md" mb={2}>
        Search for a School
      </Heading>
      <Input
        placeholder="Enter school name"
        value={schoolQuery}
        onChange={(e) => setSchoolQuery(e.target.value)}
      />
      <Button
        variant="redButton"
        onClick={triggerSchoolSearch}
        isLoading={searching}
        mt={2}
      >
        {" "}
        Search Schools
      </Button>

      {schoolSearchAttempted && !searching && filteredSchools.length === 0 && (
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
            bg={isSelected ? "blue.50" : "white"}
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
  );
};

export default SchoolSearchCard;
