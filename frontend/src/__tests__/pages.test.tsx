import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import HomePage from "@/app/page";
import LoginPage from "@/app/login/page";
import AdminPage from "@/app/admin/page";
import UserPage from "@/app/user/page";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push })
}));

const mockFetch = (handlers: Record<string, unknown>) => {
  return vi.fn(async (input: RequestInfo) => {
    const url = String(input);
    const match = Object.keys(handlers).find((key) => url.includes(key));
    if (!match) {
      return { ok: true, json: async () => ({}) } as Response;
    }
    return { ok: true, json: async () => handlers[match] } as Response;
  });
};

describe("pages", () => {
  beforeEach(() => {
    push.mockClear();
    localStorage.clear();
  });

  it("renders HomePage links", () => {
    render(<HomePage />);
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText("Admin Console")).toBeInTheDocument();
    expect(screen.getByText("User Voting")).toBeInTheDocument();
    expect(screen.getByText("Live Status")).toBeInTheDocument();
  });

  it("renders LoginPage and stores selected user", async () => {
    global.fetch = mockFetch({
      "/api/users": [
        { id: 1, name: "Admin One", email: "admin@lsvt.com", role: "ADMIN" },
        { id: 2, name: "User One", email: "user@lsvt.com", role: "USER" }
      ]
    }) as typeof fetch;

    render(<LoginPage />);
    await screen.findByText("Admin One");

    const selects = screen.getAllByRole("combobox");
    fireEvent.change(selects[0], { target: { value: "ADMIN" } });
    fireEvent.click(screen.getByText("Continue"));

    expect(localStorage.getItem("rv_current_user")).toContain("Admin One");
    expect(push).toHaveBeenCalledWith("/admin");
  });

  it("renders AdminPage and casts a vote", async () => {
    localStorage.setItem(
      "rv_current_user",
      JSON.stringify({ id: 1, name: "Admin One", email: "admin@lsvt.com", role: "ADMIN" })
    );

    global.fetch = mockFetch({
      "/api/rooms": [{ id: 1, name: "Room A", latitude: 1, longitude: 2 }],
      "/api/resolutions": [
        {
          id: 10,
          title: "Resolution A",
          description: "Desc",
          status: "VOTING",
          room: { id: 1, name: "Room A", latitude: 1, longitude: 2 },
          createdAt: "2026-01-24T01:10:00Z",
          updatedAt: "2026-01-24T01:10:00Z",
          publishAt: "2026-01-24T01:12:00Z",
          votingStartAt: "2026-01-24T01:14:00Z",
          votingEndAt: "2026-01-24T01:20:00Z",
          votingStartedAt: "2026-01-24T01:14:00Z",
          votingEndedAt: null
        }
      ],
      "/api/users": [{ id: 1, name: "Admin One", email: "admin@lsvt.com", role: "ADMIN" }],
      "/api/resolutions/10/results": {
        resolutionId: 10,
        resolutionTitle: "Resolution A",
        resolutionDescription: "Desc",
        status: "CLOSED",
        room: { id: 1, name: "Room A", latitude: 1, longitude: 2 },
        totalVotes: 0,
        forCount: 0,
        againstCount: 0,
        abstainCount: 0,
        directVotes: { total: 0, forCount: 0, againstCount: 0, abstainCount: 0 },
        proxyVotes: { total: 0, forCount: 0, againstCount: 0, abstainCount: 0 }
      },
      "/api/resolutions/10/votes": {}
    }) as typeof fetch;

    render(<AdminPage />);
    await screen.findByText("Admin Console");

    fireEvent.click(screen.getByText("Voting & Results"));
    await screen.findByText("Cast Vote");

    fireEvent.click(screen.getByText("Cast Vote"));
    await screen.findByText("Vote submitted.");

    fireEvent.click(screen.getByText("Users"));
    expect(screen.getByText("User Directory")).toBeInTheDocument();
  });

  it("allows editing published resolution before voting starts", async () => {
    localStorage.setItem(
      "rv_current_user",
      JSON.stringify({ id: 1, name: "Admin One", email: "admin@lsvt.com", role: "ADMIN" })
    );

    global.fetch = mockFetch({
      "/api/rooms": [{ id: 1, name: "Room A", latitude: 1, longitude: 2 }],
      "/api/resolutions": [
        {
          id: 10,
          title: "Resolution A",
          description: "Desc",
          status: "PUBLISHED",
          room: { id: 1, name: "Room A", latitude: 1, longitude: 2 },
          createdAt: "2026-01-24T01:10:00Z",
          updatedAt: "2026-01-24T01:10:00Z",
          publishAt: "2026-01-24T01:12:00Z",
          votingStartAt: "2026-01-24T01:14:00Z",
          votingEndAt: "2026-01-24T01:20:00Z",
          votingStartedAt: null,
          votingEndedAt: null
        }
      ],
      "/api/users": [{ id: 1, name: "Admin One", email: "admin@lsvt.com", role: "ADMIN" }],
      "/api/resolutions/10/results": {
        resolutionId: 10,
        resolutionTitle: "Resolution A",
        resolutionDescription: "Desc",
        status: "CLOSED",
        room: { id: 1, name: "Room A", latitude: 1, longitude: 2 },
        totalVotes: 0,
        forCount: 0,
        againstCount: 0,
        abstainCount: 0,
        directVotes: { total: 0, forCount: 0, againstCount: 0, abstainCount: 0 },
        proxyVotes: { total: 0, forCount: 0, againstCount: 0, abstainCount: 0 }
      }
    }) as typeof fetch;

    render(<AdminPage />);
    await screen.findByText("Admin Console");

    fireEvent.click(screen.getByText("Resolutions"));
    await screen.findByText("Resolution Directory");
    expect(screen.getByText("Edit")).toBeInTheDocument();
  });

  it("redirects to login when admin is not authenticated", async () => {
    global.fetch = mockFetch({
      "/api/rooms": [],
      "/api/resolutions": [],
      "/api/users": []
    }) as typeof fetch;

    render(<AdminPage />);
    await waitFor(() => {
      expect(push).toHaveBeenCalledWith("/login");
    });
  });

  it("renders UserPage and shows dashboard", async () => {
    localStorage.setItem(
      "rv_current_user",
      JSON.stringify({ id: 2, name: "User One", email: "user@lsvt.com", role: "USER" })
    );

    global.fetch = mockFetch({
      "/api/resolutions": [
        {
          id: 10,
          title: "Resolution A",
          description: "Desc",
          status: "PUBLISHED",
          room: { id: 1, name: "Room A", latitude: 1, longitude: 2 },
          createdAt: "2026-01-24T01:10:00Z",
          updatedAt: "2026-01-24T01:10:00Z",
          publishAt: "2026-01-24T01:12:00Z",
          votingStartAt: null,
          votingEndAt: null,
          votingStartedAt: null,
          votingEndedAt: null
        }
      ],
      "/api/users": [{ id: 2, name: "User One", email: "user@lsvt.com", role: "USER" }],
      "/api/resolutions/10/results": {
        resolutionId: 10,
        resolutionTitle: "Resolution A",
        resolutionDescription: "Desc",
        status: "CLOSED",
        room: { id: 1, name: "Room A", latitude: 1, longitude: 2 },
        totalVotes: 0,
        forCount: 0,
        againstCount: 0,
        abstainCount: 0,
        directVotes: { total: 0, forCount: 0, againstCount: 0, abstainCount: 0 },
        proxyVotes: { total: 0, forCount: 0, againstCount: 0, abstainCount: 0 }
      }
    }) as typeof fetch;

    render(<UserPage />);
    await screen.findByText("Published to Vote");
  });

  it("navigates to results panel from completed resolutions", async () => {
    localStorage.setItem(
      "rv_current_user",
      JSON.stringify({ id: 2, name: "User One", email: "user@lsvt.com", role: "USER" })
    );

    global.fetch = mockFetch({
      "/api/resolutions": [
        {
          id: 10,
          title: "Resolution A",
          description: "Desc",
          status: "RESULTS_PUBLISHED",
          room: { id: 1, name: "Room A", latitude: 1, longitude: 2 },
          createdAt: "2026-01-24T01:10:00Z",
          updatedAt: "2026-01-24T01:10:00Z",
          publishAt: "2026-01-24T01:12:00Z",
          votingStartAt: "2026-01-24T01:14:00Z",
          votingEndAt: "2026-01-24T01:20:00Z",
          votingStartedAt: "2026-01-24T01:14:00Z",
          votingEndedAt: "2026-01-24T01:20:00Z"
        }
      ],
      "/api/users": [{ id: 2, name: "User One", email: "user@lsvt.com", role: "USER" }],
      "/api/resolutions/10/results": {
        resolutionId: 10,
        resolutionTitle: "Resolution A",
        resolutionDescription: "Desc",
        status: "RESULTS_PUBLISHED",
        room: { id: 1, name: "Room A", latitude: 1, longitude: 2 },
        totalVotes: 1,
        forCount: 1,
        againstCount: 0,
        abstainCount: 0,
        directVotes: { total: 1, forCount: 1, againstCount: 0, abstainCount: 0 },
        proxyVotes: { total: 0, forCount: 0, againstCount: 0, abstainCount: 0 }
      }
    }) as typeof fetch;

    render(<UserPage />);
    await screen.findByText("Completed Resolutions");

    fireEvent.click(screen.getByText("Completed Resolutions"));
    await screen.findByText("View Results");
    fireEvent.click(screen.getByText("View Results"));

    await screen.findByText("Voting Results");
    expect(screen.getByText("Resolution A")).toBeInTheDocument();
  });

  it("shows location mismatch message when vote is rejected", async () => {
    localStorage.setItem(
      "rv_current_user",
      JSON.stringify({ id: 2, name: "User One", email: "user@lsvt.com", role: "USER" })
    );

    global.fetch = vi.fn(async (input: RequestInfo, init?: RequestInit) => {
      const url = String(input);
      if (url.includes("/api/resolutions/10/votes") && init?.method === "POST") {
        return {
          ok: false,
          text: async () =>
            JSON.stringify({ message: "Voting location does not match the resolution room" })
        } as Response;
      }
      if (url.includes("/api/resolutions/10/results")) {
        return {
          ok: true,
          json: async () => ({
            resolutionId: 10,
            resolutionTitle: "Resolution A",
            resolutionDescription: "Desc",
            status: "CLOSED",
            room: { id: 1, name: "Room A", latitude: 1, longitude: 2 },
            totalVotes: 0,
            forCount: 0,
            againstCount: 0,
            abstainCount: 0,
            directVotes: { total: 0, forCount: 0, againstCount: 0, abstainCount: 0 },
            proxyVotes: { total: 0, forCount: 0, againstCount: 0, abstainCount: 0 }
          })
        } as Response;
      }
      if (url.includes("/api/resolutions")) {
        return {
          ok: true,
          json: async () => [
            {
              id: 10,
              title: "Resolution A",
              description: "Desc",
              status: "VOTING",
              room: { id: 1, name: "Room A", latitude: 1, longitude: 2 },
              createdAt: "2026-01-24T01:10:00Z",
              updatedAt: "2026-01-24T01:10:00Z",
              publishAt: "2026-01-24T01:12:00Z",
              votingStartAt: "2026-01-24T01:14:00Z",
              votingEndAt: "2026-01-24T01:20:00Z",
              votingStartedAt: "2026-01-24T01:14:00Z",
              votingEndedAt: null
            }
          ]
        } as Response;
      }
      if (url.includes("/api/users")) {
        return {
          ok: true,
          json: async () => [{ id: 2, name: "User One", email: "user@lsvt.com", role: "USER" }]
        } as Response;
      }
      return { ok: true, json: async () => ({}) } as Response;
    }) as typeof fetch;

    render(<UserPage />);
    await screen.findByText("Published to Vote");

    fireEvent.click(screen.getByText("Submit Vote"));

    await screen.findByText(
      "Vote rejected: your location must exactly match the resolution room coordinates."
    );
  });
});
