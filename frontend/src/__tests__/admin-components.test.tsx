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
  room: { name: "Room A" }
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
    fireEvent.click(screen.getByText("Create Room"));
    expect(onChange).toHaveBeenCalled();
    expect(onSubmit).toHaveBeenCalled();
  });

  it("handles ResolutionFormCard changes and submit", () => {
    const onChange = vi.fn();
    const onSubmit = vi.fn();
    render(
      <ResolutionFormCard
        resolutionForm={{ title: "", description: "", roomId: "" }}
        onChange={onChange}
        onSubmit={onSubmit}
      />
    );

    fireEvent.change(screen.getByPlaceholderText("Title"), { target: { value: "Resolution A" } });
    fireEvent.click(screen.getByText("Create Resolution"));
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
            room: { id: 1, name: "Room A", latitude: 1, longitude: 2 }
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
