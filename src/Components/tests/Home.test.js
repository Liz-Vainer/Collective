import { render, fireEvent, screen } from "@testing-library/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { expect } from "chai"; // For assertions
import Home from "../Homepage/Home";
import { UserProvider } from "../UserContext";
import '@testing-library/jest-dom'; // For assertions

// Mock the useUser hook
jest.mock('../UserContext', () => ({
  ...jest.requireActual('../UserContext'),
  useUser: () => ({
    user: { id: 1, name: 'John Doe' }  // Mocked user data
  })
}));

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
