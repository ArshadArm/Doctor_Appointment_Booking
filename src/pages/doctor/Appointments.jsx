// src/pages/doctor/Appointments.jsx
import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { appointmentUsecase } from "../../usecases/appointment.usecase";
import { useAuth } from "../../services/auth.service";
import {
  notifySuccess,
  notifyError,
} from "../../services/notification.service";

export default function DoctorAppointments() {
  const { user } = useAuth();
  const [list, setList] = useState([]);

  async function load() {
    try {
      const appts = await appointmentUsecase.findByDoctor(user.id);
      setList(appts);
    } catch (e) {
      console.error(e);
      notifyError("Failed to load appointments");
    }
  }
  useEffect(() => {
    load();
    window.addEventListener("dab_db_change", load);
    return () => window.removeEventListener("dab_db_change", load);
  }, [user?.id]);

  async function updateStatus(id, status) {
    // optimistic update
    const prev = [...list];
    setList((s) => s.map((it) => (it.id === id ? { ...it, status } : it)));
    try {
      await appointmentUsecase.update(id, { status });
      notifySuccess("Status updated");
    } catch (e) {
      console.error(e);
      setList(prev);
      notifyError("Failed to update status");
    }
  }

  return (
    <DashboardLayout>
      <h2 className="text-xl font-bold">Appointments</h2>
      <div className="mt-4 bg-white p-4 rounded shadow">
        {list.length === 0 && (
          <div className="text-slate-500">No appointments</div>
        )}
        {list.map((a) => (
          <div
            key={a.id}
            className="p-3 border-b flex justify-between items-center"
          >
            <div>
              <div className="font-medium">
                {a.date} {a.time}
              </div>
              <div className="text-sm text-slate-600">{a.reason}</div>
              <div className="text-xs text-slate-500">Status: {a.status}</div>
            </div>
            <div className="flex gap-2">
              <button
                className="px-2 py-1 border rounded"
                onClick={() => updateStatus(a.id, "done")}
              >
                Mark Done
              </button>
              <button
                className="px-2 py-1 border rounded"
                onClick={() => updateStatus(a.id, "cancelled")}
              >
                Cancel
              </button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}