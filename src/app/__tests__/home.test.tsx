import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@/components/layout/PageWrapper", () => ({
  PageWrapper: ({ children }: { children: React.ReactNode }) => <main>{children}</main>,
}));

import HomePage from "@/app/page";

describe("HomePage", () => {
  it("renders without crashing", () => {
    render(<HomePage />);
    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("renders the main heading", () => {
    render(<HomePage />);
    expect(screen.getByRole("heading", { name: /ready to vote/i })).toBeInTheDocument();
  });

  it("renders the election status card", () => {
    render(<HomePage />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders all 6 quick action cards", () => {
    render(<HomePage />);
    const grid = screen.getByRole("list", { name: /quick action links/i });
    const items = grid.querySelectorAll('[role="listitem"]');
    expect(items).toHaveLength(6);
  });

  it("renders the Ask a Question CTA link", () => {
    render(<HomePage />);
    const cta = screen.getByRole("link", { name: /ask a voting question/i });
    expect(cta).toBeInTheDocument();
    expect(cta).toHaveAttribute("href", "/chat");
  });

  it("renders the first-time voter banner", () => {
    render(<HomePage />);
    const banner = screen.getByRole("link", { name: /first-time voter/i });
    expect(banner).toBeInTheDocument();
    expect(banner).toHaveAttribute("href", "/guide");
  });

  it("renders links for all quick actions", () => {
    render(<HomePage />);
    const links = screen.getAllByRole("link");
    // At minimum: 6 quick actions + CTA + first-time banner
    expect(links.length).toBeGreaterThanOrEqual(8);
  });

  it("status card has correct aria-live attribute", () => {
    render(<HomePage />);
    const status = screen.getByRole("status");
    expect(status).toHaveAttribute("aria-live", "polite");
  });
});
