import { render, fireEvent, screen } from "@testing-library/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { expect } from "chai"; // For assertions
import Home from "../Homepage/Home";
import { UserProvider } from "../UserContext";
import "@testing-library/jest-dom"; // For assertions

// Mock the useUser hook
jest.mock("../UserContext", () => ({
  ...jest.requireActual("../UserContext"),
  useUser: () => ({
    user: { id: 1, name: "John Doe" }, // Mocked user data
  }),
}));

// Mock the Google Maps API
jest.mock("@react-google-maps/api", () => ({
  GoogleMap: ({ children }) => <div data-testid="google-map">{children}</div>,
  Marker: ({ title }) => <div>{title}</div>,
  InfoWindow: ({ children }) => <div data-testid="info-window">{children}</div>,
}));

// Mock fetch for communities
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve([
        { id: 1, name: "Art Lovers", category: "Entertainment" },
        { id: 2, name: "Football Fans", category: "Sport" },
        { id: 3, name: "Chess Club", category: "Sport" },
        { id: 4, name: "Youth Group", category: "Religion" },
      ]),
  })
);

describe("Community marker click test", () => {
  it("displays the correct info when a community marker is clicked", () => {
    // Step 1: Render the Home component wrapped in UserProvider
    render(
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/home" element={<Home />} />
          </Routes>
        </Router>
      </UserProvider>
    );

    // Step 2: Find the community marker (e.g., "Art Lovers")
    const marker = screen.getByText("Art Lovers");

    // Step 3: Simulate clicking the marker
    fireEvent.click(marker);

    // Step 4: Check if the correct info is displayed
    const info = screen.getByText("Welcome to Art Lovers community!"); // Adjust this to match the expected info text
    expect(info).to.exist; // Assert that the info exists
  });
});

describe("Filter functionality", () => {
  it("filters communities based on category and search query", async () => {
    // Step 1: Render the Home component wrapped in UserProvider
    render(
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/home" element={<Home />} />
          </Routes>
        </Router>
      </UserProvider>
    );

    // Step 2: Wait for the communities to load
    expect(await screen.findByText("Art Lovers")).toBeInTheDocument();

    // Step 3: Filter by category: "Sport"
    const sportCategoryButton = screen.getByText("Sport");
    fireEvent.click(sportCategoryButton);

    // Step 4: Verify only Sport communities are displayed
    expect(screen.getByText("Football Fans")).toBeInTheDocument();
    expect(screen.getByText("Chess Club")).toBeInTheDocument();
    expect(screen.queryByText("Art Lovers")).not.toBeInTheDocument();
    expect(screen.queryByText("Youth Group")).not.toBeInTheDocument();

    // Step 5: Add a search query: "Football"
    const searchInput = screen.getByPlaceholderText("Search...");
    fireEvent.change(searchInput, { target: { value: "Football" } });

    // Step 6: Verify only "Football Fans" is displayed
    expect(screen.getByText("Football Fans")).toBeInTheDocument();
    expect(screen.queryByText("Chess Club")).not.toBeInTheDocument();
  });
});
