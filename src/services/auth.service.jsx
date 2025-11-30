// src/services/auth.service.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { localDb } from "./localDb.service";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Load from localStorage on startup
  useEffect(() => {
    const saved = localStorage.getItem("auth_user");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (err) {
        console.error("Failed to parse saved user:", err);
      }
    }
  }, []);

  // -------------------------
  // LOGIN (ASYNC + SAFE)
  // -------------------------
  const login = async (email, password) => {
    try {
      const users = await localDb.getCollection("users");

      if (!Array.isArray(users)) {
        console.error("Users collection is INVALID:", users);
        return { success: false, message: "Internal database error" };
      }

      const found = users.find(
        (u) => u.email === email && u.password === password
      );

      if (!found) {
        return { success: false, message: "Invalid email or password" };
      }

      setUser(found);
      localStorage.setItem("auth_user", JSON.stringify(found));

      return { success: true, user: found };
    } catch (error) {
      console.error("LOGIN FAILED:", error);
      return { success: false, message: "Unexpected error" };
    }
  };

  // -------------------------
  // LOGIN AS ANOTHER USER
  // -------------------------
  const loginAs = async (id) => {
    try {
      const users = await localDb.getCollection("users");

      if (!Array.isArray(users)) {
        console.error("Users collection is INVALID:", users);
        return null;
      }

      const found = users.find((u) => u.id === id);
      if (!found) return null;

      setUser(found);
      localStorage.setItem("auth_user", JSON.stringify(found));

      return found;
    } catch (error) {
      console.error("loginAs FAILED:", error);
      return null;
    }
  };

  // -------------------------
  // LOGOUT
  // -------------------------
  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_user");
  };

  // -------------------------
  // CONTEXT PROVIDER
  // -------------------------
  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loginAs,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// -------------------------
// useAuth Hook
// -------------------------
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return context;
}