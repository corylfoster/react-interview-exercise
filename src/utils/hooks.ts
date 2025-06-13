import { useEffect } from "react";
import { NCESSchoolFeatureAttributes } from "@utils/nces";

export const useDeselectIfFilteredOut = (
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
