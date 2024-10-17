import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import InviteForm from "./index"; // Adjust the import path as necessary
import "@testing-library/jest-dom";
import { API_URL, FAILED_MSG, SUCCESS_MSG } from "./constants";

const noop = () => {};
// Mock the fetch API globally
global.fetch = jest.fn();

describe("InviteForm Validation", () => {
  it("shows validation errors for empty form", async () => {
    render(<InviteForm onClose={noop} />);

    fireEvent.submit(screen.getByRole("button", { name: /send/i }));

    // Expect all three validation errors
    expect(
      await screen.findByText("Full Name is required")
    ).toBeInTheDocument();
    expect(await screen.findByText("Email is required")).toBeInTheDocument();
    expect(
      await screen.findByText("Please confirm your email")
    ).toBeInTheDocument();
  });

  it("shows validation error for very short Full Name", async () => {
    render(<InviteForm onClose={noop} />);

    fireEvent.change(screen.getByLabelText("Full Name"), {
      target: { value: "a" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /send/i }));

    // Expect validation error for Full Name
    expect(
      await screen.findByText("Full Name must be at least 3 characters")
    ).toBeInTheDocument();
  });

  it("shows validation error for invalid email format", async () => {
    render(<InviteForm onClose={noop} />);

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "invalid-email" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /send/i }));

    // Expect validation error for Email
    expect(
      await screen.findByText(/invalid email format/i)
    ).toBeInTheDocument();
  });

  it("shows validation error for mismatched emails", async () => {
    render(<InviteForm onClose={() => {}} />);

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Confirm Email"), {
      target: { value: "different@example.com" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /send/i }));

    // Expect validation error for Confirm Email
    expect(await screen.findByText("Emails must match")).toBeInTheDocument();
  });

  it("shows validation error for empty email field", async () => {
    render(<InviteForm onClose={() => {}} />);

    fireEvent.change(screen.getByLabelText("Full Name"), {
      target: { value: "John Doe" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /send/i }));

    // Expect validation error for Email
    expect(await screen.findByText("Email is required")).toBeInTheDocument();
  });

  it("shows validation error for empty Confirm Email field", async () => {
    render(<InviteForm onClose={() => {}} />);

    fireEvent.change(screen.getByLabelText("Full Name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /send/i }));

    // Expect validation error for Confirm Email
    expect(
      await screen.findByText("Please confirm your email")
    ).toBeInTheDocument();
  });
});

describe("InviteForm API Submission", () => {
  beforeEach(() => {
    // Reset the fetch mock before each test
    (fetch as jest.Mock).mockClear();
  });

  it("handles 200 OK response", async () => {
    // Mock the API to return a 200 OK response
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "Success" }),
    });

    render(<InviteForm onClose={noop} />);

    // Fill in the form fields
    fireEvent.change(screen.getByLabelText("Full Name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "john.doe@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Confirm Email"), {
      target: { value: "john.doe@example.com" },
    });

    // Submit the form
    fireEvent.click(screen.getByText("Send"));

    // Wait for the fetch call to complete
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "John Doe",
          email: "john.doe@example.com",
        }),
      });
    });

    // Assert success behavior (could be an alert or other UI change)
    await waitFor(() => {
      expect(screen.getByText(SUCCESS_MSG)).toBeInTheDocument();
      expect(screen.getByText("Close")).toBeInTheDocument();
    });
  });

  it("handles 400 Bad Request response", async () => {
    // Mock the API to return a 400 Bad Request response
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Invalid email" }),
    });

    render(<InviteForm onClose={noop} />);

    // Fill in the form fields
    fireEvent.change(screen.getByLabelText("Full Name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "john.doe@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Confirm Email"), {
      target: { value: "john.doe@example.com" },
    });

    // Submit the form
    fireEvent.click(screen.getByText("Send"));

    // Wait for the fetch call to complete
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "John Doe",
          email: "john.doe@example.com",
        }),
      });
    });

    // Assert error behavior (could be an alert or other UI change)
    await waitFor(() => {
      expect(screen.getByText(FAILED_MSG)).toBeInTheDocument();
    });
  });

  it("handles network error during API call", async () => {
    // Mock the API to throw an error (network failure)
    (fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

    render(<InviteForm onClose={noop} />);

    // Fill in the form fields
    fireEvent.change(screen.getByLabelText("Full Name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "john.doe@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Confirm Email"), {
      target: { value: "john.doe@example.com" },
    });

    // Submit the form
    fireEvent.click(screen.getByText("Send"));

    // Wait for the fetch call to be made
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "John Doe",
          email: "john.doe@example.com",
        }),
      });
    });

    // Check that an error message is displayed due to network failure
    await waitFor(() => {
      expect(screen.getByText(FAILED_MSG)).toBeInTheDocument();
    });
  });
});
