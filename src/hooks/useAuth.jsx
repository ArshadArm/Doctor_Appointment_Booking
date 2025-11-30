// src/hooks/useAuth.js
import { useEffect, useState } from "react";
import { useAuth as useAuthService } from "../services/auth.service";

export function useAuthHook() {
  // wrap the service to keep a predictable hook shape
  const auth = useAuthService();
  const [user, setUser] = useState(auth.user);

  useEffect(() => {
    setUser(auth.user);
    // no subscription model; keep in sync via localStorage events if needed
    function onStorage() {
      const saved = localStorage.getItem("auth_user");
      setUser(saved ? JSON.parse(saved) : null);
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [auth.user]);

  return {
    user,
    login: auth.login,
    loginAs: auth.loginAs,
    logout: auth.logout,
    isLoggedIn: !!user,
  };
}