import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import ApiBaseField from "@/components/common/ApiBaseField";
import SectionCard from "@/components/common/SectionCard";

describe("common components", () => {
  it("renders SectionCard with title and content", () => {
    render(
      <SectionCard title="Card Title">
        <div>Body Content</div>
      </SectionCard>
    );

    expect(screen.getByText("Card Title")).toBeInTheDocument();
    expect(screen.getByText("Body Content")).toBeInTheDocument();
  });

  it("updates ApiBaseField value", () => {
    const handleChange = vi.fn();
    render(<ApiBaseField value="http://localhost" onChange={handleChange} />);

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "http://api" } });
    expect(handleChange).toHaveBeenCalledWith("http://api");
  });
});
