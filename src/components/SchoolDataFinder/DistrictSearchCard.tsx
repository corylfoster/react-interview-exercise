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
import { NCESDistrictFeatureAttributes } from "@utils/nces";

// Props interface for the DistrictSearchCard component
interface DistrictSearchCardProps {
  districtQuery: string; // The current search query for districts
  setDistrictQuery: (query: string) => void; // Function to update the district search query
  triggerDistrictSearch: () => void; // Function to trigger a district search
  searching: boolean; // Indicates whether a search is currently in progress
  districts: NCESDistrictFeatureAttributes[]; // List of districts returned from the search
  districtSearchAttempted: boolean; // Indicates whether a district search has been attempted
  selectedDistrict: string | undefined; // The currently selected district ID
  setSelectedDistrict: (districtId: string | undefined) => void; // Function to update the selected district
}

// Component for searching and selecting school districts
const DistrictSearchCard: React.FC<DistrictSearchCardProps> = ({
  districtQuery,
  setDistrictQuery,
  triggerDistrictSearch,
  searching,
  districts,
  districtSearchAttempted,
  selectedDistrict,
  setSelectedDistrict,
}) => {
  return (
    <Card
      variant="rounded"
      bg="brand.darkGreen"
      borderColor="brand.darkGreen"
      flex="1"
      width="100%"
    >
      {/* Heading for the district search card */}
      {/* @ts-ignore */}
      <Heading color="white" size="md" mb={2} as="h2">
        Search for a District
      </Heading>
      {/* Input field for entering the district search query */}
      <Input
        placeholder="Enter district name"
        value={districtQuery}
        onChange={(e) => setDistrictQuery(e.target.value)}
      />
      {/* Button to trigger the district search */}
      <Button
        variant="redButton"
        onClick={triggerDistrictSearch}
        isLoading={searching} // Show a loading spinner if a search is in progress
        mt={2}
      >
        Search Districts
      </Button>
      {/* Message displayed if no districts are found after a search */}
      {districtSearchAttempted && !searching && districts.length === 0 && (
        <Text mt={4} color="red.500">
          No districts found matching your search.
        </Text>
      )}
      {/* Instructional message displayed if districts are found */}
      {districts.length > 0 && (
        <Text mt={4} fontStyle="italic" color="white">
          Please choose a district, then search for a school
        </Text>
      )}
      {/* List of districts returned from the search */}
      {districts.map((d) => (
        <Box
          datatype="district-result" // Custom attribute for testing or debugging
          key={d.LEAID} // Unique key for each district
          p={2}
          borderWidth="1px"
          borderRadius="md"
          mt={2}
          bg={selectedDistrict === d.LEAID ? "blue.50" : "white"} // Highlight the selected district
          cursor="pointer"
          width="100%"
          onClick={() =>
            setSelectedDistrict(
              selectedDistrict === d.LEAID ? undefined : d.LEAID // Toggle selection
            )
          }
        >
          <HStack>
            {/* Checkbox to indicate the selected district */}
            <Checkbox
              isChecked={selectedDistrict === d.LEAID}
              pointerEvents="none" // Prevent interaction with the checkbox directly
              mr={3}
            />
            <VStack align="start" spacing={0}>
              {/* Display the district name */}
              <Text fontWeight="bold">{d.NAME}</Text>
              {/* Display the district's city, state, and ZIP code */}
              <Text fontSize="sm">
                {d.LCITY}, {d.LSTATE} {d.LZIP}
              </Text>
            </VStack>
          </HStack>
        </Box>
      ))}
    </Card>
  );
};

export default DistrictSearchCard;
