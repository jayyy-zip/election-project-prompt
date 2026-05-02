import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("@/components/layout/PageWrapper", () => ({
  PageWrapper: ({ children }: { children: React.ReactNode }) => <main>{children}</main>,
}));

vi.mock("@/components/booth/BoothEditSheet", () => ({
  BoothEditSheet: ({ booth, onClose }: { booth: { boothName: string } | null; onClose: () => void }) =>
    booth ? (
      <div role="dialog" aria-label="Edit booth dialog">
        <p>Editing: {booth.boothName}</p>
        <button onClick={onClose}>Close</button>
      </div>
    ) : null,
}));

vi.mock("@/components/ui/Toast", () => ({
  ToastContainer: () => null,
  useToast: () => ({ toasts: [], addToast: vi.fn(), removeToast: vi.fn() }),
}));

import BoothPage from "@/app/booth/page";

beforeEach(() => {
  localStorage.clear();
});

describe("BoothPage", () => {
  it("renders the page heading", () => {
    render(<BoothPage />);
    expect(screen.getByRole("heading", { name: /polling booth finder/i })).toBeInTheDocument();
  });

  it("renders the search form", () => {
    render(<BoothPage />);
    expect(screen.getByRole("search")).toBeInTheDocument();
  });

  it("renders suggested area pills", () => {
    render(<BoothPage />);
    expect(screen.getByLabelText(/search booths in andheri west/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/search booths in powai/i)).toBeInTheDocument();
  });

  it("shows validation error for single-character input", async () => {
    const user = userEvent.setup();
    render(<BoothPage />);

    await user.type(screen.getByPlaceholderText(/type your area/i), "A");
    await user.keyboard("{Enter}");

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
  });

  it("returns booths for 'Andheri West'", async () => {
    const user = userEvent.setup();
    render(<BoothPage />);

    await user.click(screen.getByLabelText(/search booths in andheri west/i));

    await waitFor(() => {
      expect(screen.getByText(/booth.*found/i)).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it("shows empty state for unrecognised area", async () => {
    const user = userEvent.setup();
    render(<BoothPage />);

    await user.type(screen.getByPlaceholderText(/type your area/i), "Narnia Somewhere");
    await user.keyboard("{Enter}");

    await waitFor(() => {
      expect(screen.getByText(/no booths found/i)).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it("shows Clear button after search", async () => {
    const user = userEvent.setup();
    render(<BoothPage />);

    await user.click(screen.getByLabelText(/search booths in juhu/i));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /clear/i })).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it("clicking Clear resets results", async () => {
    const user = userEvent.setup();
    render(<BoothPage />);

    await user.click(screen.getByLabelText(/search booths in juhu/i));
    await waitFor(() => screen.getByRole("button", { name: /clear/i }), { timeout: 2000 });

    await user.click(screen.getByRole("button", { name: /clear/i }));

    // Suggested pills should reappear
    await waitFor(() => {
      expect(screen.getByLabelText(/search booths in andheri west/i)).toBeInTheDocument();
    });
  });

  it("opens edit sheet when Edit button is clicked", async () => {
    const user = userEvent.setup();
    render(<BoothPage />);

    await user.click(screen.getByLabelText(/search booths in andheri west/i));
    await waitFor(() => screen.getAllByRole("button", { name: /edit/i }), { timeout: 2000 });

    const editBtns = screen.getAllByRole("button", { name: /edit/i });
    await user.click(editBtns[0]);

    expect(screen.getByRole("dialog", { name: /edit booth dialog/i })).toBeInTheDocument();
  });

  it("closes edit sheet when Close is clicked", async () => {
    const user = userEvent.setup();
    render(<BoothPage />);

    await user.click(screen.getByLabelText(/search booths in andheri west/i));
    await waitFor(() => screen.getAllByRole("button", { name: /edit/i }), { timeout: 2000 });

    await user.click(screen.getAllByRole("button", { name: /edit/i })[0]);
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /close/i }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders Google Maps direction link for found booths", async () => {
    const user = userEvent.setup();
    render(<BoothPage />);

    await user.click(screen.getByLabelText(/search booths in versova/i));

    await waitFor(() => {
      const links = screen.getAllByRole("link", { name: /google maps/i });
      expect(links.length).toBeGreaterThan(0);
    }, { timeout: 2000 });
  });
});
