import "@testing-library/jest-dom";
import { vi } from "vitest";

process.env.NODE_ENV = "test";

vi.mock("next/link", async () => {
  const React = await import("react");
  return {
    default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) =>
      React.createElement("a", { href, ...props }, children)
  };
});
