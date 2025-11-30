// src/pages/patient/Dashboard.jsx
import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../services/auth.service";
import { appointmentUsecase } from "../../usecases/appointment.usecase";
import { localDb } from "../../services/localDb.service";
import {
  notifySuccess,
  notifyError,
} from "../../services/notification.service";
import ReportViewer from "../../components/ReportViewer";

export default function PatientDashboard() {
  const { user } = useAuth();
  const [my, setMy] = useState([]);
  const [viewing, setViewing] = useState(null);

  async function load() {
    if (!user) return setMy([]);
    const list = await appointmentUsecase.findByPatient(user.id);
    setMy(list);
  }

  useEffect(() => {
    load();
    window.addEventListener(localDb.DB_CHANGE_EVENT, load);
    return () => window.removeEventListener(localDb.DB_CHANGE_EVENT, load);
  }, [user?.id]);

  async function cancelAppointment(id) {
    if (!window.confirm("Cancel this appointment?")) return;
    try {
      await appointmentUsecase.update(id, { status: "cancelled" });
      notifySuccess("Appointment cancelled");
      load();
    } catch (err) {
      console.error(err);
      notifyError("Failed to cancel");
    }
  }

  return (
    <DashboardLayout>
      <h2 className="text-xl font-bold">Hello, {user?.name}</h2>
      <div className="mt-4 bg-white p-4 rounded shadow">
        <h3 className="font-bold">My Appointments</h3>
        {my.length === 0 && (
          <div className="text-slate-500 mt-2">No appointments yet.</div>
        )}
        {my.map((a) => (
          <div
            key={a.id}
            className="py-2 border-b flex justify-between items-center"
          >
            <div>
              {a.date} {a.time} — {a.status}
              {a.report && (
                <div className="text-xs text-slate-500">Report available</div>
              )}
            </div>
            <div className="flex gap-2">
              {a.status !== "cancelled" && (
                <button
                  onClick={() => cancelAppointment(a.id)}
                  className="px-2 py-1 border rounded"
                >
                  Cancel
                </button>
              )}
              {a.report && (
                <button
                  onClick={() => setViewing(a)}
                  className="px-2 py-1 border rounded"
                >
                  View Report
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {viewing && (
        <div className="mt-4">
          <h3 className="font-bold">
            Report for {viewing.date} {viewing.time}
          </h3>
          <ReportViewer report={viewing.report} appointment={viewing} />
        </div>
      )}
    </DashboardLayout>
  );
}