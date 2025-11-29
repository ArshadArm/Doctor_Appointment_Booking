import React from "react";
import { useAuth } from "../../services/auth.service";
import { useNavigate } from "react-router-dom";
import { localDb } from "../../services/localDb.service";

export default function Login() {
  const { loginAs } = useAuth();
  const nav = useNavigate();
  const users = localDb.getCollection("users");

  function onLogin(e) {
    e.preventDefault();
    const id = e.target.userId.value;
    const user = loginAs(id);
    if (user) {
      if (user.role === "admin") nav("/admin");
      else if (user.role === "doctor") nav("/doctor");
      else nav("/patient");
    } else {
      alert("User not found!");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center app-bg">
      <form onSubmit={onLogin} className="bg-white p-6 rounded shadow w-96">
        <h2 className="text-2xl font-bold mb-4">Sign in (demo)</h2>
        <label className="block mb-2 text-sm">Choose user</label>
        <select name="userId" className="w-full p-2 border rounded mb-4">
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