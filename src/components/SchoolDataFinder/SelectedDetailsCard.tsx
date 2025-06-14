import React from "react";
import { Heading, Text, Box, VStack } from "@chakra-ui/react";
import { Card } from "@components/design/Card";
import { googleMapsKey } from "@utils/maps"; // Import the Google Maps API key
import {
  NCESDistrictFeatureAttributes,
  NCESSchoolFeatureAttributes,
} from "@utils/nces";

// Props interface for the SelectedDetailsCard component
interface SelectedDetailsCardProps {
  selectedDistrictObj: NCESDistrictFeatureAttributes | undefined; // The currently selected district object
  selectedSchool: NCESSchoolFeatureAttributes | null; // The currently selected school object
}

// Component for displaying details of the selected district or school
const SelectedDetailsCard: React.FC<SelectedDetailsCardProps> = ({
  selectedDistrictObj,
  selectedSchool,
}) => {
  return (
    <Card
      variant="rounded"
      bg="brand.darkGreen" // Background color for the card
      borderColor="brand.darkGreen" // Border color for the card
      color="white" // Text color
      flex="1"
      width="100%"
    >
      {/* Heading for the selected details card */}
      <Heading size="md" mb={2} as="h2">
        Selected Details
      </Heading>
      {/* Message displayed if no district or school is selected */}
      {!selectedDistrictObj && !selectedSchool ? (
        <Text fontStyle="italic">
          Please choose a district or a school to see results.
        </Text>
      ) : (
        <VStack align="start" spacing={6}>
          {/* Display details of the selected district */}
          {selectedDistrictObj && (
            <Box>
              <Text fontWeight="bold">{selectedDistrictObj.NAME}</Text>
              <Text>
                {selectedDistrictObj.LCITY}, {selectedDistrictObj.LSTATE}{" "}
                {selectedDistrictObj.LZIP}
              </Text>
            </Box>
          )}

          {/* Display details of the selected school */}
          {selectedSchool && (
            <Box>
              <Text fontWeight="bold">{selectedSchool.NAME}</Text>
              <Text mb={4}>
                {selectedSchool.STREET}, {selectedSchool.CITY},{" "}
                {selectedSchool.STATE} {selectedSchool.ZIP}
              </Text>

              {/* Embedded Google Maps iframe for the selected school */}
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
  );
};

export default SelectedDetailsCard;
