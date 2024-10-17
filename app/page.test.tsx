import { render, screen, fireEvent } from "@testing-library/react";
import Home from "./page";
// import Modal from "./mnodal";

describe("Home Modal behavior", () => {
  it("opens the modal when 'Request an Invite' button is clicked", () => {
    // Render the Home component
    render(<Home />);

    // Modal should not be visible initially
    expect(screen.queryByText("Full Name")).not.toBeInTheDocument();

    // Click the 'Request an Invite' button
    fireEvent.click(screen.getByText("Request an Invite"));

    // Modal should appear with the invite form content
    expect(screen.getByText("Full Name")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Send")).toBeInTheDocument();
  });

  it("closes the modal when the 'X' button is clicked", () => {
    // Render the Home component
    render(<Home />);

    // Open the modal by clicking the 'Request an Invite' button
    fireEvent.click(screen.getByText("Request an Invite"));

    // The modal should be visible
    expect(screen.getByText("Full Name")).toBeInTheDocument();

    // Click the 'X' button to close the modal
    fireEvent.click(screen.getByLabelText("Close modal"));

    // The modal should no longer be visible
    expect(screen.queryByText("Full Name")).not.toBeInTheDocument();
  });
});
