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

interface DistrictSearchCardProps {
  districtQuery: string;
  setDistrictQuery: (query: string) => void;
  triggerDistrictSearch: () => void;
  searching: boolean;
  districts: NCESDistrictFeatureAttributes[];
  districtSearchAttempted: boolean;
  selectedDistrict: string | undefined;
  setSelectedDistrict: (districtId: string | undefined) => void;
}

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
      <Heading color="white" size="md" mb={2}>
        Search for a District
      </Heading>
      <Input
        placeholder="Enter district name"
        value={districtQuery}
        onChange={(e) => setDistrictQuery(e.target.value)}
      />
      <Button
        variant="redButton"
        onClick={triggerDistrictSearch}
        isLoading={searching}
        mt={2}
      >
        Search Districts
      </Button>

      {districtSearchAttempted && !searching && districts.length === 0 && (
        <Text mt={4} color="red.500">
          No districts found matching your search.
        </Text>
      )}

      {districts.length > 0 && (
        <Text mt={4} fontStyle="italic" color="white">
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
          bg={selectedDistrict === d.LEAID ? "blue.50" : "white"}
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
  );
};

export default DistrictSearchCard;
