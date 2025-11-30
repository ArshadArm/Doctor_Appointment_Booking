// src/components/layout/DashboardLayout.jsx
import React from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../services/auth.service";
import { Link } from "react-router-dom";

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen flex app-bg">
      <aside className="w-64 p-4 border-r bg-white/60 backdrop-blur">
        <div className="font-bold text-xl mb-4">Doctor Appointment</div>
        <div className="mb-4">
          Signed in as <div className="font-medium">{user?.name ?? "—"}</div>
        </div>
        <nav className="flex flex-col gap-2">
          {user?.role === "admin" && (
            <>
              <Link
                to="/admin"
                className="block p-2 rounded hover:bg-slate-100"
              >
                Dashboard
              </Link>
              <Link
                to="/admin/doctors"
                className="block p-2 rounded hover:bg-slate-100"
              >
                Doctors
              </Link>
              <Link
                to="/admin/patients"
                className="block p-2 rounded hover:bg-slate-100"
              >
                Patients
              </Link>
            </>
          )}
          {user?.role === "doctor" && (
            <>
              <Link
                to="/doctor"
                className="block p-2 rounded hover:bg-slate-100"
              >
                Dashboard
              </Link>
              <Link
                to="/doctor/appointments"
                className="block p-2 rounded hover:bg-slate-100"
              >
                Appointments
              </Link>
            </>
          )}
          {user?.role === "patient" && (
            <>
              <Link
                to="/patient"
                className="block p-2 rounded hover:bg-slate-100"
              >
                Dashboard
              </Link>
              <Link
                to="/patient/book"
                className="block p-2 rounded hover:bg-slate-100"
              >
                Book Appointment
              </Link>
            </>
          )}
        </nav>
        <div className="mt-8">
          <button onClick={() => logout()} className="text-sm text-red-600">
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6">
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}