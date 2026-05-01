import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("@/components/layout/PageWrapper", () => ({
  PageWrapper: ({ children }: { children: React.ReactNode }) => <main>{children}</main>,
}));

import BoothPage from "@/app/booth/page";

describe("BoothPage", () => {
  it("renders the page heading", () => {
    render(<BoothPage />);
    expect(screen.getByRole("heading", { name: /polling booth finder/i })).toBeInTheDocument();
  });

  it("renders the search form", () => {
    render(<BoothPage />);
    expect(screen.getByRole("search")).toBeInTheDocument();
  });

  it("renders suggested area buttons", () => {
    render(<BoothPage />);
    expect(screen.getByLabelText(/search for booths in andheri west/i)).toBeInTheDocument();
  });

  it("returns booths for 'Andheri West'", async () => {
    const user = userEvent.setup();
    render(<BoothPage />);

    const input = screen.getByPlaceholderText(/type your area/i);
    await user.type(input, "Andheri West");
    await user.keyboard("{Enter}");

    await waitFor(() => {
      expect(screen.getByText(/booth.*found/i)).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it("shows empty state for unrecognised area", async () => {
    const user = userEvent.setup();
    render(<BoothPage />);

    const input = screen.getByPlaceholderText(/type your area/i);
    await user.type(input, "Narnia");
    await user.keyboard("{Enter}");

    await waitFor(() => {
      expect(screen.getByText(/no booths found/i)).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it("shows validation error for 1-character input", async () => {
    const user = userEvent.setup();
    render(<BoothPage />);

    const input = screen.getByPlaceholderText(/type your area/i);
    await user.type(input, "A");
    await user.keyboard("{Enter}");

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
  });

  it("clicking a suggested area triggers search", async () => {
    const user = userEvent.setup();
    render(<BoothPage />);

    const powaiBtn = screen.getByLabelText(/search for booths in powai/i);
    await user.click(powaiBtn);

    await waitFor(() => {
      expect(screen.getByText(/booth.*found/i)).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it("renders Google Maps link for found booth", async () => {
    const user = userEvent.setup();
    render(<BoothPage />);

    const btn = screen.getByLabelText(/search for booths in andheri west/i);
    await user.click(btn);

    await waitFor(() => {
      const mapsLinks = screen.getAllByText(/open in google maps/i);
      expect(mapsLinks.length).toBeGreaterThan(0);
    }, { timeout: 2000 });
  });
});
