import { describe, expect, it } from "vitest";
import { formatActivityLogText } from "./catalogSettings";

describe("formatActivityLogText", () => {
  it("writes one human-readable line per event", () => {
    const text = formatActivityLogText([
      {
        at: "2026-09-18T13:02:11.000Z",
        type: "login_ok",
        message: "Admin signed in",
        detail: "",
      },
      {
        at: "2026-09-18T13:03:00.000Z",
        type: "order_ok",
        message: "Order placed",
        detail: "xn-1 · $12.00",
      },
    ]);
    expect(text).toContain("login_ok  Admin signed in");
    expect(text).toContain("order_ok  Order placed — xn-1 · $12.00");
    expect(text.split("\n")).toHaveLength(2);
  });
});
