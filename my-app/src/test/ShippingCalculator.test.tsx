import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import App from "../App";

// Mock the fetch API globally
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      shippingCost: 50.25,
      estimatedDays: 4,
      breakdown: {
        "Base Rate": 10,
        "Zone Multiplier": 1.5,
        "Size Multiplier": 1.2,
        "Package Size Category": "Large",
        "Weight Surcharge": 5.0,
        "Weight": 10,
        "Shipping Method": "Express",
        "Destination Zone": "Domestic"
      }
    }),
  })
) as jest.Mock;

describe("Shipping Calculator Form", () => {
  it("submits valid input, calls the API, and displays shipping results", async () => {
    // Render the component
    render(<App />);
    
    // Fill in form fields with valid data
    fireEvent.change(screen.getByLabelText(/Shipping Method/i), { target: { value: "Express" } });
    fireEvent.change(screen.getByLabelText(/Weight \(kg\)/i), { target: { value: "10" } });
    fireEvent.change(screen.getByPlaceholderText(/Length/i), { target: { value: "50" } });
    fireEvent.change(screen.getByPlaceholderText(/Width/i), { target: { value: "30" } });
    fireEvent.change(screen.getByPlaceholderText(/Height/i), { target: { value: "20" } });
    fireEvent.change(screen.getByLabelText(/Destination Zone/i), { target: { value: "Domestic" } });

    // Click the Calculate button
    fireEvent.click(screen.getByRole("button", { name: /Calculate/i }));

    // Wait for the API result to appear in the UI
    await waitFor(() => {
      // Check that shipping cost and breakdown appear
      expect(screen.getByText(/Shipping Cost:/i)).toHaveTextContent("Shipping Cost: $50.25");
      expect(screen.getByText(/Estimated Delivery:/i)).toHaveTextContent("Estimated Delivery: 4 days");
      expect(screen.getByText(/Base Rate/i)).toBeInTheDocument();
      expect(screen.getByText(/Zone Multiplier/i)).toBeInTheDocument();
      expect(screen.getByText(/Package Size Category/i)).toHaveTextContent("Package Size Category");
    });

    expect(fetch).toHaveBeenCalledWith(
      "https://shipping-calculator.matthayward.workers.dev/calculate",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shippingMethod: "Express",
          weight: 10,
          dimensions: { length: 50, width: 30, height: 20 },
          destinationZone: "Domestic",
        }),
      })
    );
  });
});

/*
  Purpose of this test:
  - Simulates a user filling out the shipping calculator form with valid data.
  - Mocks the API response to avoid a real network request.
  - Checks that after submission, the UI displays the returned shipping cost, estimated days, and detailed breakdown.
  - Verifies the correct API endpoint and payload were used in the fetch call.
  - Ensures your React app is fully integrated between user input, API logic, and results rendering.
*/
