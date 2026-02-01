import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import ActiveResolutionCard from "@/components/user/ActiveResolutionCard";
import UserResolutionList from "@/components/user/UserResolutionList";
import UserResultsPanel from "@/components/user/UserResultsPanel";
import UserVoteCard from "@/components/user/UserVoteCard";

describe("user components", () => {
  it("renders ActiveResolutionCard empty state", () => {
    render(<ActiveResolutionCard resolution={null} />);
    expect(screen.getByText("No active voting session yet. Check back soon.")).toBeInTheDocument();
  });

  it("renders ActiveResolutionCard with resolution", () => {
    render(
      <ActiveResolutionCard
        resolution={{
          id: 1,
          title: "Resolution A",
          description: "Desc",
          status: "VOTING",
          room: { id: 1, name: "Room A", latitude: 1, longitude: 2 }
        }}
      />
    );
    expect(screen.getByText("Resolution A")).toBeInTheDocument();
    expect(screen.getByText("Room: Room A")).toBeInTheDocument();
  });

  it("renders UserResolutionList and triggers selection", () => {
    const onSelect = vi.fn();
    render(
      <UserResolutionList
        resolutions={[
          {
            id: 1,
            title: "Resolution A",
            description: "Desc",
            status: "PUBLISHED",
            room: { id: 1, name: "Room A", latitude: 1, longitude: 2 }
          }
        ]}
        onSelectResults={onSelect}
      />
    );

    fireEvent.click(screen.getByText("View Results"));
    expect(onSelect).toHaveBeenCalledWith(1);
  });

  it("renders UserResultsPanel empty state", () => {
    render(<UserResultsPanel results={null} />);
    expect(screen.getByText("Results will appear once voting closes.")).toBeInTheDocument();
  });

  it("renders UserResultsPanel with results", () => {
    render(
      <UserResultsPanel
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

  it("renders UserVoteCard with proxy selection", () => {
    const onChange = vi.fn();
    const onSubmit = vi.fn();
    render(
      <UserVoteCard
        voteForm={{
          resolutionId: "1",
          proxyForUserId: "",
          proxyForName: "",
          choice: "FOR",
          latitude: "",
          longitude: ""
        }}
        onChange={onChange}
        onSubmit={onSubmit}
        resolutions={[
          { id: 1, title: "Resolution A", room: { name: "Room A" } }
        ]}
        users={[{ id: 2, name: "Proxy" }]}
        isProxyVoting
        currentUserId={1}
        currentUserRole="USER"
      />
    );

    expect(screen.getByText("Room: Room A")).toBeInTheDocument();
    const selects = screen.getAllByRole("combobox");
    fireEvent.change(selects[1], { target: { value: "2" } });
    fireEvent.click(screen.getByText("Submit Vote"));
    expect(onChange).toHaveBeenCalled();
    expect(onSubmit).toHaveBeenCalled();
  });

  it("blocks admin proxy selection for normal users", () => {
    const onChange = vi.fn();
    const onSubmit = vi.fn();
    render(
      <UserVoteCard
        voteForm={{
          resolutionId: "1",
          proxyForUserId: "2",
          proxyForName: "Admin",
          choice: "FOR",
          latitude: "",
          longitude: ""
        }}
        onChange={onChange}
        onSubmit={onSubmit}
        resolutions={[{ id: 1, title: "Resolution A", room: { name: "Room A" } }]}
        users={[{ id: 2, name: "Admin", role: "ADMIN" }]}
        isProxyVoting
        currentUserId={1}
        currentUserRole="USER"
      />
    );

    expect(screen.getByText("Proxy voting for admins is not allowed. Select a different user.")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Submit Vote"));
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
