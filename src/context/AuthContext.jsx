import { createContext, useCallback, useContext, useMemo, useState } from "react";

export const AUTH_KEY = "Auth";
export const GUEST_KEY = "xenonGuest";

function readUser() {
  try {
    const raw = sessionStorage.getItem(AUTH_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

function readGuestFlag() {
  return sessionStorage.getItem(GUEST_KEY) === "1";
}

function sessionFromStorage() {
  const user = readUser();
  if (user) {
    return { status: "user", user };
  }
  if (readGuestFlag()) {
    return { status: "guest", user: null };
  }
  return { status: "none", user: null };
}

export function safeReturnPath(value) {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) {
    return "/shop";
  }
  return value;
}

export function loginPath(next = "/shop") {
  return `/login_signup?next=${encodeURIComponent(safeReturnPath(next))}`;
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(sessionFromStorage);

  const loginUser = useCallback((payload) => {
    sessionStorage.setItem(AUTH_KEY, JSON.stringify(payload));
    sessionStorage.removeItem(GUEST_KEY);
    setSession({ status: "user", user: payload });
  }, []);

  const enterAsGuest = useCallback(() => {
    sessionStorage.removeItem(AUTH_KEY);
    sessionStorage.setItem(GUEST_KEY, "1");
    setSession({ status: "guest", user: null });
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem(GUEST_KEY);
    setSession({ status: "none", user: null });
  }, []);

  const status = session.status;
  const value = useMemo(
    () => ({
      status,
      user: session.user,
      isGuest: status === "guest",
      canBrowse: status === "guest" || status === "user",
      canCart: status === "user",
      loginUser,
      enterAsGuest,
      logout,
    }),
    [status, session.user, loginUser, enterAsGuest, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return value;
}
