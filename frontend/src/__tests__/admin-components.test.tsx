import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import AdminResultsPanel from "@/components/admin/AdminResultsPanel";
import AdminVoteCard from "@/components/admin/AdminVoteCard";
import ResolutionFormCard from "@/components/admin/ResolutionFormCard";
import ResolutionList from "@/components/admin/ResolutionList";
import RoomFormCard from "@/components/admin/RoomFormCard";

const sampleResolution = {
  id: 10,
  title: "Resolution A",
  description: "Desc",
  status: "DRAFT",
  room: { id: 1, name: "Room A", latitude: 1, longitude: 2 },
  createdAt: "2026-01-24T01:10:00Z",
  updatedAt: "2026-01-24T01:10:00Z",
  publishAt: "2026-01-24T01:12:00Z",
  votingStartAt: "2026-01-24T01:14:00Z",
  votingEndAt: "2026-01-24T01:20:00Z",
  votingStartedAt: null,
  votingEndedAt: null
};

describe("admin components", () => {
  it("renders AdminResultsPanel empty state", () => {
    render(<AdminResultsPanel results={null} />);
    expect(screen.getByText("Results not available yet.")).toBeInTheDocument();
  });

  it("renders AdminResultsPanel with results", () => {
    render(
      <AdminResultsPanel
        results={{
          resolutionId: 10,
          resolutionTitle: "Resolution A",
          resolutionDescription: "Desc",
          status: "CLOSED",
          room: { id: 1, name: "Room A", latitude: 1, longitude: 2 },
          totalVotes: 5,
          forCount: 3,
          againstCount: 2,
          abstainCount: 0,
          directVotes: { total: 4, forCount: 2, againstCount: 2, abstainCount: 0 },
          proxyVotes: { total: 1, forCount: 1, againstCount: 0, abstainCount: 0 }
        }}
      />
    );
    expect(screen.getByText("Resolution A")).toBeInTheDocument();
    expect(screen.getByText("Room: Room A")).toBeInTheDocument();
  });

  it("handles RoomFormCard changes and submit", () => {
    const onChange = vi.fn();
    const onSubmit = vi.fn();
    render(
      <RoomFormCard
        roomForm={{ name: "", latitude: "", longitude: "" }}
        onChange={onChange}
        onSubmit={onSubmit}
      />
    );

    fireEvent.change(screen.getByPlaceholderText("Room name"), { target: { value: "Room A" } });
    fireEvent.click(screen.getByRole("button", { name: "Create Room" }));
    expect(onChange).toHaveBeenCalled();
    expect(onSubmit).toHaveBeenCalled();
  });

  it("handles ResolutionFormCard changes and submit", () => {
    const onChange = vi.fn();
    const onSubmit = vi.fn();
    render(
      <ResolutionFormCard
        resolutionForm={{
          title: "",
          description: "",
          roomId: "",
          publishAt: "",
          votingStartAt: "",
          votingEndAt: ""
        }}
        onChange={onChange}
        onSubmit={onSubmit}
      />
    );

    fireEvent.change(screen.getByPlaceholderText("Title"), { target: { value: "Resolution A" } });
    fireEvent.change(screen.getByPlaceholderText("Publish date/time"), { target: { value: "2026-02-16T10:30" } });
    fireEvent.click(screen.getByRole("button", { name: "Create Resolution" }));
    expect(onChange).toHaveBeenCalled();
    expect(onSubmit).toHaveBeenCalled();
  });

  it("renders ResolutionList and triggers actions", () => {
    const onAction = vi.fn();
    render(
      <ResolutionList
        resolutions={[
          {
            id: 10,
            title: "Resolution A",
            description: "Desc",
            status: "DRAFT",
            room: { id: 1, name: "Room A", latitude: 1, longitude: 2 },
            createdAt: "2026-01-24T01:10:00Z",
            updatedAt: "2026-01-24T01:10:00Z",
            publishAt: null,
            votingStartAt: null,
            votingEndAt: null,
            votingStartedAt: null,
            votingEndedAt: null
          }
        ]}
        onAction={onAction}
      />
    );

    fireEvent.click(screen.getByText("Publish"));
    expect(onAction).toHaveBeenCalledWith(10, "publish");
  });

  it("renders AdminVoteCard proxy selection and self proxy warning", () => {
    const onChange = vi.fn();
    const onSubmit = vi.fn();
    render(
      <AdminVoteCard
        voteForm={{
          resolutionId: "10",
          proxyForUserId: "2",
          proxyForName: "Self",
          choice: "FOR",
          latitude: "",
          longitude: ""
        }}
        onChange={onChange}
        onSubmit={onSubmit}
        resolutions={[sampleResolution]}
        users={[
          { id: 2, name: "Self" },
          { id: 3, name: "Other" }
        ]}
        isProxyVoting
        currentUserId={2}
      />
    );

    expect(screen.getByText("Room: Room A")).toBeInTheDocument();
    expect(screen.getByText("You cannot cast a proxy vote for yourself. Select a different user.")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Cast Vote"));
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
