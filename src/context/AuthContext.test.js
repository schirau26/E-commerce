import { describe, expect, it } from "vitest";
import { loginPath, safeReturnPath } from "./AuthContext";

describe("auth return paths", () => {
  it("falls back to the shop for blank or unsafe next values", () => {
    expect(safeReturnPath(null)).toBe("/shop");
    expect(safeReturnPath("//evil.example")).toBe("/shop");
    expect(safeReturnPath("https://evil.example")).toBe("/shop");
  });

  it("keeps internal paths", () => {
    expect(safeReturnPath("/ViewProduct/12")).toBe("/ViewProduct/12");
    expect(loginPath("/Checkout")).toBe(
      "/login_signup?next=%2FCheckout",
    );
  });
});
