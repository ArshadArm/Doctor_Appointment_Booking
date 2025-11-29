import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import routes from "./routes";
import { AuthProvider } from "./services/auth.service";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {routes.map((r) => (
          <Route key={r.path} path={r.path} element={r.element} />
        ))}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}