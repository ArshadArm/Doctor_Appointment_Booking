// src/pages/auth/Login.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../services/auth.service";
import { useNavigate } from "react-router-dom";
import { localDb } from "../../services/localDb.service";
import { notifyError } from "../../services/notification.service";

export default function Login() {
  const { login, loginAs } = useAuth();
  const [users, setUsers] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    // load demo users
    async function load() {
      const u = await localDb.getCollection("users");
      setUsers(u);
    }
    load();
    const onChange = () => load();
    window.addEventListener(localDb.DB_CHANGE_EVENT, onChange);
    return () => window.removeEventListener(localDb.DB_CHANGE_EVENT, onChange);
  }, []);

  async function onLogin(e) {
    e.preventDefault();
    const id = e.target.userId?.value;
    if (!id) return notifyError("Please choose a user");
    const user = await loginAs(id);
    if (user) {
      if (user.role === "admin") nav("/admin");
      else if (user.role === "doctor") nav("/doctor");
      else nav("/patient");
    } else {
      notifyError("User not found");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center app-bg">
      <form onSubmit={onLogin} className="bg-white p-6 rounded shadow w-96">
        <h2 className="text-2xl font-bold mb-4">Sign in (demo)</h2>
        <label className="block mb-2 text-sm">Choose user</label>
        <select name="userId" className="w-full p-2 border rounded mb-4">
          <option value="">Select a user...</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name} — {u.role}
            </option>
          ))}
        </select>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded">
            Sign in
          </button>
        </div>
      </form>
    </div>
  );
}