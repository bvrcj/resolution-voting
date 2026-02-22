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

    expect(screen.getByRole("heading", { name: "Console" })).toBeInTheDocument();
    fireEvent.click(screen.getByText("Two"));
    expect(onSelect).toHaveBeenCalledWith("two");
  });

  it("renders TempleHeader links", () => {
    render(<TempleHeader />);
    expect(screen.getByText("Shiva-Vishnu Temple")).toBeInTheDocument();
  });

  it("renders TempleFooter content", () => {
    render(<TempleFooter />);
    expect(screen.getByText(/Hindu Community and Cultural Center/)).toBeInTheDocument();
    expect(screen.getByText(/Terms and Conditions/)).toBeInTheDocument();
  });
});
