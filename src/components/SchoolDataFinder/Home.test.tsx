import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Home from "./Home";
import { searchSchoolDistricts, searchSchools } from "@utils/nces";

// Mock the API functions
jest.mock("@utils/nces", () => ({
  searchSchoolDistricts: jest.fn(),
  searchSchools: jest.fn(),
}));

describe("Home Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the heading and child components", () => {
    render(<Home />);

    // Check for the heading
    expect(
      screen.getByRole("heading", { name: /school data finder/i })
    ).toBeInTheDocument();

    // Check for the presence of child components
    expect(
      screen.getByPlaceholderText(/enter district name/i)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/enter school name/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/please choose a district or a school to see results/i)
    ).toBeInTheDocument();
  });

  it("triggers district search and displays results", async () => {
    // Mock the district search API response
    const mockDistricts = [
      {
        LEAID: "123",
        NAME: "District 1",
        LCITY: "City 1",
        LSTATE: "State 1",
        LZIP: "12345",
      },
      {
        LEAID: "456",
        NAME: "District 2",
        LCITY: "City 2",
        LSTATE: "State 2",
        LZIP: "67890",
      },
    ];
    (searchSchoolDistricts as jest.Mock).mockResolvedValue(mockDistricts);

    render(<Home />);

    // Enter a district query and trigger search
    fireEvent.change(screen.getByPlaceholderText(/enter district name/i), {
      target: { value: "District" },
    });
    fireEvent.click(screen.getByText(/search districts/i));

    // Wait for the results to appear
    await waitFor(() => {
      expect(searchSchoolDistricts).toHaveBeenCalledWith("District");
      expect(screen.getByText(/district 1/i)).toBeInTheDocument();
      expect(screen.getByText(/district 2/i)).toBeInTheDocument();
    });
  });

  it("triggers school search and displays results", async () => {
    // Mock the school search API response
    const mockSchools = [
      {
        NCESSCH: "789",
        NAME: "School 1",
        STREET: "Street 1",
        CITY: "City 1",
        STATE: "State 1",
        ZIP: "12345",
      },
      {
        NCESSCH: "101",
        NAME: "School 2",
        STREET: "Street 2",
        CITY: "City 2",
        STATE: "State 2",
        ZIP: "67890",
      },
    ];
    (searchSchools as jest.Mock).mockResolvedValue(mockSchools);

    render(<Home />);

    // Enter a school query and trigger search
    fireEvent.change(screen.getByPlaceholderText(/enter school name/i), {
      target: { value: "School" },
    });
    fireEvent.click(screen.getByText(/search schools/i));

    // Wait for the results to appear
    await waitFor(() => {
      expect(searchSchools).toHaveBeenCalledWith("School", undefined);
      expect(screen.getByText(/school 1/i)).toBeInTheDocument();
      expect(screen.getByText(/school 2/i)).toBeInTheDocument();
    });
  });

  it("updates SelectedDetailsCard when a district is selected", async () => {
    // Mock the district search API response
    const mockDistricts = [
      {
        LEAID: "123",
        NAME: "District 1",
        LCITY: "City 1",
        LSTATE: "State 1",
        LZIP: "12345",
      },
    ];
    (searchSchoolDistricts as jest.Mock).mockResolvedValue(mockDistricts);

    render(<Home />);

    // Trigger district search
    fireEvent.change(screen.getByPlaceholderText(/enter district name/i), {
      target: { value: "District" },
    });
    fireEvent.click(screen.getByText(/search districts/i));

    // Wait for the results and select the first matching district
    await waitFor(() => {
      const districtElements = screen.getAllByText(/district 1/i); // Get all matching elements
      fireEvent.click(districtElements[0]); // Click the first one (from the search results)
    });

    // Check that SelectedDetailsCard updates
    expect(screen.getByText(/district 1/i)).toBeInTheDocument();
    expect(screen.getByText(/city 1, state 1 12345/i)).toBeInTheDocument();
  });

  it("updates SelectedDetailsCard when a school is selected", async () => {
    // Mock the school search API response
    const mockSchools = [
      {
        NCESSCH: "789",
        NAME: "School 1",
        STREET: "Street 1",
        CITY: "City 1",
        STATE: "State 1",
        ZIP: "12345",
      },
    ];
    (searchSchools as jest.Mock).mockResolvedValue(mockSchools);

    render(<Home />);

    // Trigger school search
    fireEvent.change(screen.getByPlaceholderText(/enter school name/i), {
      target: { value: "School" },
    });
    fireEvent.click(screen.getByText(/search schools/i));

    // Wait for the results and select the first matching school
    await waitFor(() => {
      const schoolElements = screen.getAllByText(/school 1/i); // Get all matching elements
      fireEvent.click(schoolElements[0]); // Click the first one (from the search results)
    });

    // Check that SelectedDetailsCard updates
    expect(screen.getByText(/school 1/i)).toBeInTheDocument();
    expect(
      screen.getByText(/street 1, city 1, state 1 12345/i)
    ).toBeInTheDocument();
  });
});
