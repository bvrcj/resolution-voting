import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import SidebarNav from "@/components/layout/SidebarNav";
import TempleHeader from "@/components/layout/TempleHeader";
import TempleFooter from "@/components/layout/TempleFooter";

describe("layout components", () => {
  it("renders SidebarNav items and handles selection", () => {
    const onSelect = vi.fn();
    render(
      <SidebarNav
        title="Console"
        items={[
          { id: "one", label: "One" },
          { id: "two", label: "Two" }
        ]}
        activeId="one"
        onSelect={onSelect}
      />
    );

    expect(screen.getByText("Console")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Two"));
    expect(onSelect).toHaveBeenCalledWith("two");
  });

  it("renders TempleHeader links", () => {
    render(<TempleHeader />);
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText("Admin")).toBeInTheDocument();
    expect(screen.getByText("User")).toBeInTheDocument();
  });

  it("renders TempleFooter content", () => {
    render(<TempleFooter />);
    expect(screen.getByText("Stay Connected")).toBeInTheDocument();
    expect(screen.getByText("Subscribe")).toBeInTheDocument();
  });
});
