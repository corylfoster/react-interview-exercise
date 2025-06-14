import { useEffect } from "react";
import { NCESSchoolFeatureAttributes } from "@utils/nces";

/**
 * Custom hook to automatically deselect a school if it is no longer in the filtered list of schools.
 *
 * @param selectedSchool - The currently selected school object, or `null` if no school is selected.
 * @param filteredSchools - The list of schools that match the current filter criteria.
 * @param setSelectedSchool - A state setter function to update the selected school.
 */
export const useDeselectIfFilteredOut = (
  selectedSchool: NCESSchoolFeatureAttributes | null,
  filteredSchools: NCESSchoolFeatureAttributes[],
  setSelectedSchool: React.Dispatch<
    React.SetStateAction<NCESSchoolFeatureAttributes | null>
  >
) => {
  useEffect(() => {
    // Check if a school is selected and if it is no longer in the filtered list
    if (
      selectedSchool &&
      !filteredSchools.some((s) => s.NCESSCH === selectedSchool.NCESSCH)
    ) {
      // If the selected school is not in the filtered list, deselect it
      setSelectedSchool(null);
    }
  }, [filteredSchools, selectedSchool, setSelectedSchool]); // Dependencies: re-run the effect when these values change
};
