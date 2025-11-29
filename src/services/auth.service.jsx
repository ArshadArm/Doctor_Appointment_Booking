import { createContext, useContext, useState, useEffect } from "react";
import { localDb } from "./localDb.service";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("auth_user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const login = (email, password) => {
    const users = localDb.getCollection("users");
    const found = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!found) return { success: false, message: "Invalid email or password" };

    setUser(found);
    localStorage.setItem("auth_user", JSON.stringify(found));
    return { success: true, user: found };
  };

  const loginAs = (id) => {
    const users = localDb.getCollection("users");
    const found = users.find((u) => u.id === id);
    if (!found) return null;

    setUser(found);
    localStorage.setItem("auth_user", JSON.stringify(found));
    return found;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loginAs }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}