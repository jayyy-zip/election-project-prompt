import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("@/lib/gemini", () => ({
  askGemini: vi.fn().mockRejectedValue(new Error("Not configured")),
  isGeminiConfigured: vi.fn().mockReturnValue(false),
}));

vi.mock("@/components/layout/BottomNav", () => ({
  BottomNav: () => <nav aria-label="Main navigation" />,
}));

vi.mock("@/components/layout/Header", () => ({
  Header: () => <header><h1>VoteSmart</h1></header>,
}));

import ChatPage from "@/app/chat/page";

beforeEach(() => localStorage.clear());

describe("ChatPage", () => {
  it("renders the chat container", () => {
    render(<ChatPage />);
    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("renders the message log", () => {
    render(<ChatPage />);
    expect(screen.getByRole("log")).toBeInTheDocument();
  });

  it("welcome message is inside the log", () => {
    render(<ChatPage />);
    const log = screen.getByRole("log");
    expect(log.textContent).toMatch(/election assistant|hi.*vote/i);
  });

  it("renders suggested question chips", () => {
    render(<ChatPage />);
    expect(screen.getByLabelText(/ask: how do i vote/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/ask: when is the election/i)).toBeInTheDocument();
  });

  it("sends a message when Enter is pressed", async () => {
    const user = userEvent.setup();
    render(<ChatPage />);

    const input = screen.getByLabelText(/type your question/i);
    await user.type(input, "When is the election?");
    await user.keyboard("{Enter}");

    await waitFor(() => {
      expect(screen.getByText("When is the election?")).toBeInTheDocument();
    });
  });

  it("shows bot reply after sending message", async () => {
    const user = userEvent.setup();
    render(<ChatPage />);

    await user.click(screen.getByLabelText(/ask: how do i vote/i));

    await waitFor(() => {
      const log = screen.getByRole("log");
      expect(log.textContent).toMatch(/booth|step|polling/i);
    }, { timeout: 2000 });
  });

  it("shows fallback message for unknown query", async () => {
    const user = userEvent.setup();
    render(<ChatPage />);

    const input = screen.getByLabelText(/type your question/i);
    await user.type(input, "Tell me about quantum physics please?");
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

    // Only the welcome message reply
    const replies = screen.getAllByLabelText(/assistant reply/i);
    expect(replies).toHaveLength(1);
  });

  it("clear button resets to welcome message", async () => {
    const user = userEvent.setup();
    render(<ChatPage />);

    await user.click(screen.getByLabelText(/ask: how do i vote/i));
    await waitFor(() => screen.getAllByLabelText(/your message|assistant reply/i), { timeout: 2000 });

    // The clear button has title="Clear conversation"
    await user.click(screen.getByTitle(/clear conversation/i));

    // Only welcome message should remain
    const replies = screen.getAllByLabelText(/assistant reply/i);
    expect(replies).toHaveLength(1);
  });

  it("send button is disabled when input is empty", () => {
    render(<ChatPage />);
    const sendBtn = screen.getByRole("button", { name: /send message/i });
    expect(sendBtn).toHaveAttribute("aria-disabled", "true");
  });

  it("sanitizes XSS-like input", async () => {
    const user = userEvent.setup();
    render(<ChatPage />);

    const input = screen.getByLabelText(/type your question/i);
    await user.type(input, "<script>alert('xss')</script>");
    await user.keyboard("{Enter}");

    await waitFor(() => {
      const log = screen.getByRole("log");
      expect(log.innerHTML).not.toContain("<script>");
    });
  });
});
