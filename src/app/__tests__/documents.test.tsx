import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CHECKLIST_STORAGE_KEY } from "@/lib/constants";

vi.mock("@/components/layout/PageWrapper", () => ({
  PageWrapper: ({ children }: { children: React.ReactNode }) => <main>{children}</main>,
}));

import DocumentsPage from "@/app/documents/page";

beforeEach(() => localStorage.clear());

describe("DocumentsPage", () => {
  it("renders the heading", () => {
    render(<DocumentsPage />);
    expect(screen.getByRole("heading", { name: /document checklist/i })).toBeInTheDocument();
  });

  it("renders document checkboxes", () => {
    render(<DocumentsPage />);
    expect(screen.getAllByRole("checkbox").length).toBeGreaterThan(0);
  });

  it("progress bar starts at 0", () => {
    render(<DocumentsPage />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "0");
  });

  it("toggles a document checkbox on click", async () => {
    const user = userEvent.setup();
    render(<DocumentsPage />);

    await user.click(screen.getAllByRole("checkbox")[0]);
    expect(screen.getAllByRole("checkbox")[0]).toHaveAttribute("aria-checked", "true");
  });

  it("un-toggles when clicked again", async () => {
    const user = userEvent.setup();
    render(<DocumentsPage />);

    await user.click(screen.getAllByRole("checkbox")[0]);
    expect(screen.getAllByRole("checkbox")[0]).toHaveAttribute("aria-checked", "true");

    await user.click(screen.getAllByRole("checkbox")[0]);
    expect(screen.getAllByRole("checkbox")[0]).toHaveAttribute("aria-checked", "false");
  });

  it("progress bar updates after toggling", async () => {
    const user = userEvent.setup();
    render(<DocumentsPage />);

    await user.click(screen.getAllByRole("checkbox")[0]);

    const bar = screen.getByRole("progressbar");
    expect(bar).not.toHaveAttribute("aria-valuenow", "0");
  });

  it("persists checked state to localStorage", async () => {
    const user = userEvent.setup();
    render(<DocumentsPage />);

    await user.click(screen.getAllByRole("checkbox")[0]);

    const stored = localStorage.getItem(CHECKLIST_STORAGE_KEY);
    expect(stored).not.toBeNull();
    const parsed = JSON.parse(stored!);
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed.length).toBe(1);
  });

  it("hydrates from localStorage on mount", async () => {
    // Pre-populate localStorage with first doc id from documents.json
    const firstDocId = "epic"; // real id from data/documents.json
    localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify([firstDocId]));

    render(<DocumentsPage />);

    await waitFor(() => {
      const checkboxes = screen.getAllByRole("checkbox");
      const checkedBox = checkboxes.find((c) => c.getAttribute("aria-checked") === "true");
      expect(checkedBox).toBeDefined();
    });
  });

  it("reset button clears all items", async () => {
    const user = userEvent.setup();
    render(<DocumentsPage />);

    // Check one item first
    await user.click(screen.getAllByRole("checkbox")[0]);
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /reset checklist/i })).toBeInTheDocument()
    );

    await user.click(screen.getByRole("button", { name: /reset checklist/i }));

    expect(screen.getAllByRole("checkbox")[0]).toHaveAttribute("aria-checked", "false");
    expect(localStorage.getItem(CHECKLIST_STORAGE_KEY)).toBe("[]");
  });

  it("renders the CTA link to booth finder", () => {
    render(<DocumentsPage />);
    const link = screen.getByRole("link", { name: /find my polling booth/i });
    expect(link).toHaveAttribute("href", "/booth");
  });
});
