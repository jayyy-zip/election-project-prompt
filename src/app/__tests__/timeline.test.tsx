import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("@/components/layout/PageWrapper", () => ({
  PageWrapper: ({ children }: { children: React.ReactNode }) => <main>{children}</main>,
}));

// localStorage mock is provided by jsdom

import TimelinePage from "@/app/timeline/page";

describe("TimelinePage", () => {
  it("renders the heading", () => {
    render(<TimelinePage />);
    expect(screen.getByRole("heading", { name: /election timeline/i })).toBeInTheDocument();
  });

  it("renders upcoming section", () => {
    render(<TimelinePage />);
    expect(screen.getByRole("region", { name: /upcoming/i })).toBeInTheDocument();
  });

  it("renders completed section", () => {
    render(<TimelinePage />);
    expect(screen.getByRole("region", { name: /completed/i })).toBeInTheDocument();
  });

  it("renders reminder buttons for upcoming events", () => {
    render(<TimelinePage />);
    const reminderBtns = screen.getAllByRole("button");
    expect(reminderBtns.length).toBeGreaterThan(0);
  });

  it("toggles reminder on click (aria-pressed changes)", async () => {
    const user = userEvent.setup();
    render(<TimelinePage />);

    const getUnpressedBtns = () =>
      screen.getAllByRole("button").filter(
        (b) => b.getAttribute("aria-pressed") === "false"
      );

    expect(getUnpressedBtns().length).toBeGreaterThan(0);
    const targetId = getUnpressedBtns()[0].id;
    await user.click(getUnpressedBtns()[0]);

    // Re-query by id after re-render
    const updated = document.getElementById(targetId);
    expect(updated).toHaveAttribute("aria-pressed", "true");
  });

  it("un-toggles reminder when clicked again", async () => {
    const user = userEvent.setup();
    render(<TimelinePage />);

    const getUnpressed = () =>
      screen.getAllByRole("button").filter(
        (b) => b.getAttribute("aria-pressed") === "false"
      );

    const targetId = getUnpressed()[0].id;
    await user.click(getUnpressed()[0]);
    expect(document.getElementById(targetId)).toHaveAttribute("aria-pressed", "true");

    await user.click(document.getElementById(targetId)!);
    expect(document.getElementById(targetId)).toHaveAttribute("aria-pressed", "false");
  });

  it("persists reminders to localStorage", async () => {
    const user = userEvent.setup();
    render(<TimelinePage />);

    const btns = screen.getAllByRole("button").filter(
      (b) => b.getAttribute("aria-pressed") === "false"
    );
    await user.click(btns[0]);

    const stored = localStorage.getItem("votesmart_reminders");
    expect(stored).not.toBeNull();
    const parsed = JSON.parse(stored!);
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed.length).toBeGreaterThan(0);
  });
});
