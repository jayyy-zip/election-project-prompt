import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DocumentsPage from "@/app/documents/page";

// Mock PageWrapper to avoid layout complexity in tests
vi.mock("@/components/layout/PageWrapper", () => ({
  PageWrapper: ({ children }: { children: React.ReactNode }) => <main>{children}</main>,
}));

describe("DocumentsPage", () => {
  it("renders the page heading", () => {
    render(<DocumentsPage />);
    expect(screen.getByRole("heading", { name: /document checklist/i })).toBeInTheDocument();
  });

  it("renders all document items", () => {
    render(<DocumentsPage />);
    // All doc items have role=checkbox
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes.length).toBeGreaterThan(0);
  });

  it("shows 0/N initially", () => {
    render(<DocumentsPage />);
    expect(screen.getByText(/tap each document to mark it as packed/i)).toBeInTheDocument();
  });

  it("toggles a document as packed when clicked", async () => {
    const user = userEvent.setup();
    render(<DocumentsPage />);

    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes[0]).toHaveAttribute("aria-checked", "false");
    await user.click(checkboxes[0]);
    // Re-query after React re-render
    expect(screen.getAllByRole("checkbox")[0]).toHaveAttribute("aria-checked", "true");
  });

  it("un-toggles a document when clicked again", async () => {
    const user = userEvent.setup();
    render(<DocumentsPage />);

    await user.click(screen.getAllByRole("checkbox")[0]);
    expect(screen.getAllByRole("checkbox")[0]).toHaveAttribute("aria-checked", "true");

    await user.click(screen.getAllByRole("checkbox")[0]);
    expect(screen.getAllByRole("checkbox")[0]).toHaveAttribute("aria-checked", "false");
  });

  it("renders the progress bar", () => {
    render(<DocumentsPage />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toBeInTheDocument();
    expect(bar).toHaveAttribute("aria-valuenow", "0");
  });

  it("updates progress count after toggling", async () => {
    const user = userEvent.setup();
    render(<DocumentsPage />);

    const checkboxes = screen.getAllByRole("checkbox");
    await user.click(checkboxes[0]);

    const bar = screen.getByRole("progressbar");
    expect(bar).not.toHaveAttribute("aria-valuenow", "0");
  });

  it("renders the CTA link to booth finder", () => {
    render(<DocumentsPage />);
    const link = screen.getByRole("link", { name: /find my polling booth/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/booth");
  });
});
