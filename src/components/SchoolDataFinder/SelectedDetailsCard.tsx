import React from "react";
import { Heading, Text, Box, VStack } from "@chakra-ui/react";
import { Card } from "@components/design/Card";
import { googleMapsKey } from "@utils/maps"; // Import the key from /utils/maps
import {
  NCESDistrictFeatureAttributes,
  NCESSchoolFeatureAttributes,
} from "@utils/nces";

interface SelectedDetailsCardProps {
  selectedDistrictObj: NCESDistrictFeatureAttributes | undefined;
  selectedSchool: NCESSchoolFeatureAttributes | null;
}

const SelectedDetailsCard: React.FC<SelectedDetailsCardProps> = ({
  selectedDistrictObj,
  selectedSchool,
}) => {
  return (
    <Card
      variant="rounded"
      bg="brand.darkGreen"
      borderColor="brand.darkGreen"
      color="white"
      flex="1"
      width="100%"
    >
      <Heading size="md" mb={2}>
        Selected Details
      </Heading>

      {!selectedDistrictObj && !selectedSchool ? (
        <Text fontStyle="italic">
          Please choose a district or a school to see results.
        </Text>
      ) : (
        <VStack align="start" spacing={6}>
          {selectedDistrictObj && (
            <Box>
              <Text fontWeight="bold">{selectedDistrictObj.NAME}</Text>
              <Text>
                {selectedDistrictObj.LCITY}, {selectedDistrictObj.LSTATE}{" "}
                {selectedDistrictObj.LZIP}
              </Text>
            </Box>
          )}

          {selectedSchool && (
            <Box>
              <Text fontWeight="bold">{selectedSchool.NAME}</Text>
              <Text mb={4}>
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
  );
};

export default SelectedDetailsCard;
