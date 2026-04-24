/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from "react";
import { decodeJwt } from "../utils/jwt";

const AuthContext = createContext(null);

function readStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("ngo_user")) || null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const storedToken = localStorage.getItem("token");
    const decoded = storedToken ? decodeJwt(storedToken) : null;
    return decoded
      ? {
          name: decoded.name || decoded.full_name || decoded.email || decoded.sub,
          email: decoded.email || decoded.sub,
          role: decoded.role || "donor",
        }
      : readStoredUser();
  });

  const login = ({ accessToken, profile }) => {
    const decoded = decodeJwt(accessToken);
    const resolvedProfile = {
      name: decoded?.name || decoded?.full_name || profile?.name || decoded?.email || decoded?.sub || "NGO User",
      email: decoded?.email || decoded?.sub || profile?.email,
      role: decoded?.role || profile?.role || "donor",
    };

    localStorage.setItem("token", accessToken);
    localStorage.setItem("ngo_user", JSON.stringify(resolvedProfile));
    setToken(accessToken);
    setUser(resolvedProfile);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("ngo_user");
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      role: user?.role,
      isAdmin: user?.role === "admin",
      isDonor: user?.role === "donor",
      login,
      logout,
    }),
    [token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
