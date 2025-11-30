// src/pages/admin/Reports.jsx
import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { appointmentUsecase } from "../../usecases/appointment.usecase";
import { localDb } from "../../services/localDb.service";
import ReportViewer from "../../components/ReportViewer";

export default function Reports() {
  const [appointments, setAppointments] = useState([]);
  const [selected, setSelected] = useState(null);

  async function load() {
    const all = await appointmentUsecase.list();
    setAppointments(all.filter((a) => a.report)); // only appointments with reports
  }

  useEffect(() => {
    load();
    window.addEventListener(localDb.DB_CHANGE_EVENT, load);
    return () => window.removeEventListener(localDb.DB_CHANGE_EVENT, load);
  }, []);

  return (
    <DashboardLayout>
      <h2 className="text-xl font-bold mb-4">Reports</h2>
      {appointments.length === 0 && <div>No reports available.</div>}
      <div className="bg-white p-4 rounded shadow space-y-2">
        {appointments.map((a) => (
          <div
            key={a.id}
            className="p-2 border rounded flex justify-between items-center"
          >
            <div>
              <div>
                {a.date} {a.time}
              </div>
              <div className="text-sm text-slate-600">{a.reason}</div>
            </div>
            <button
              onClick={() => setSelected(a)}
              className="px-2 py-1 border rounded bg-indigo-100"
            >
              View Report
            </button>
          </div>
        ))}
      </div>

      {selected && (
        <div className="mt-4">
          <h3 className="font-bold">
            Report for {selected.date} {selected.time}
          </h3>
          <ReportViewer report={selected.report} appointment={selected} />
        </div>
      )}
    </DashboardLayout>
  );
}