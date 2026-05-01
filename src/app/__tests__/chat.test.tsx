import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Mock Gemini so it's never called in tests
vi.mock("@/lib/gemini", () => ({
  askGemini: vi.fn().mockRejectedValue(new Error("Not configured")),
  isGeminiConfigured: vi.fn().mockReturnValue(false),
}));

vi.mock("@/components/layout/BottomNav", () => ({
  BottomNav: () => <nav aria-label="Main navigation" />,
}));

import ChatPage from "@/app/chat/page";

describe("ChatPage", () => {
  it("renders the welcome message", () => {
    render(<ChatPage />);
    const log = screen.getByRole("log");
    expect(log).toBeInTheDocument();
    // Welcome message appears inside the conversation log
    expect(log.textContent).toMatch(/election assistant|hi.*vote/i);
  });

  it("renders suggested question buttons", () => {
    render(<ChatPage />);
    expect(screen.getByLabelText(/how do i vote/i)).toBeInTheDocument();
  });

  it("sends a suggested question when clicked", async () => {
    const user = userEvent.setup();
    render(<ChatPage />);

    const howBtn = screen.getByLabelText(/ask: how do i vote/i);
    await user.click(howBtn);

    // User message should appear
    await waitFor(() => {
      expect(screen.getByText("How do I vote?")).toBeInTheDocument();
    });
  });

  it("returns a FAQ answer for 'how do I vote'", async () => {
    const user = userEvent.setup();
    render(<ChatPage />);

    const howBtn = screen.getByLabelText(/ask: how do i vote/i);
    await user.click(howBtn);

    // Bot reply should appear
    await waitFor(() => {
      // FAQ answer for voting contains "3-step" or "booth"
      const log = screen.getByRole("log");
      expect(log.textContent).toMatch(/booth|step|polling/i);
    }, { timeout: 2000 });
  });

  it("shows fallback message for unrecognised query", async () => {
    const user = userEvent.setup();
    render(<ChatPage />);

    const input = screen.getByLabelText(/type your question/i);
    await user.type(input, "What is the meaning of life?");
    await user.keyboard("{Enter}");

    await waitFor(() => {
      expect(screen.getByText(/1950|helpline/i)).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it("does not send empty messages", async () => {
    const user = userEvent.setup();
    render(<ChatPage />);

    const sendBtn = screen.getByRole("button", { name: /send message/i });
    await user.click(sendBtn);

    // Only the welcome message should be present
    const messages = screen.getAllByLabelText(/assistant reply/i);
    expect(messages).toHaveLength(1);
  });

  it("sanitizes XSS-like input before sending", async () => {
    const user = userEvent.setup();
    render(<ChatPage />);

    const input = screen.getByLabelText(/type your question/i);
    await user.type(input, "<script>alert('xss')</script>");
    await user.keyboard("{Enter}");

    // The rendered message should not contain script tags
    await waitFor(() => {
      const log = screen.getByRole("log");
      expect(log.innerHTML).not.toContain("<script>");
    });
  });

  it("renders the send button", () => {
    render(<ChatPage />);
    expect(screen.getByRole("button", { name: /send message/i })).toBeInTheDocument();
  });
});
