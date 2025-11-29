import React from "react";
import { authService } from "../services/auth.service";

export function useAuth() {
  const [user, setUser] = React.useState(authService.getUser());

  function login(email) {
    const u = authService.login(email);
    setUser(u);
    return u;
  }

  function logout() {
    authService.logout();
    setUser(null);
  }

  return { user, login, logout, isLoggedIn: !!user };
}