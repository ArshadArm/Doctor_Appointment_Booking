// src/pages/admin/Dashboard.jsx
import React from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { localDb } from "../../services/localDb.service";
import {
  notifySuccess,
  notifyError,
} from "../../services/notification.service";

export default function AdminDashboard() {
  const [counts, setCounts] = React.useState({
    doctors: 0,
    patients: 0,
    appts: 0,
  });

  async function load() {
    try {
      const users = await localDb.getCollection("users");
      const appts = await localDb.getCollection("appointments");
      setCounts({
        doctors: users.filter((u) => u.role === "doctor").length,
        patients: users.filter((u) => u.role === "patient").length,
        appts: appts.length,
      });
    } catch (e) {
      console.error(e);
      notifyError("Failed to load dashboard");
    }
  }

  React.useEffect(() => {
    load();
    window.addEventListener(localDb.DB_CHANGE_EVENT, load);
    return () => window.removeEventListener(localDb.DB_CHANGE_EVENT, load);
  }, []);

  const handleResetDB = async () => {
    const confirmed = window.confirm(
      "Are you sure? This will reset DB and reload the app."
    );
    if (!confirmed) return;
    try {
      await localDb.clear();
      notifySuccess("Database reset to defaults");
      window.location.reload();
    } catch (e) {
      console.error(e);
      notifyError("Failed to reset DB");
    }
  };

  return (
    <DashboardLayout>
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded shadow">
          Doctors
          <br />
          <div className="text-2xl font-bold">{counts.doctors}</div>
        </div>
        <div className="p-4 bg-white rounded shadow">
          Patients
          <br />
          <div className="text-2xl font-bold">{counts.patients}</div>
        </div>
        <div className="p-4 bg-white rounded shadow">
          Appointments
          <br />
          <div className="text-2xl font-bold">{counts.appts}</div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-white rounded shadow">
        <h3 className="font-bold mb-2">Database</h3>
        <div className="flex gap-2">
          <button
            onClick={() => localDb.exportJson()}
            className="px-3 py-2 bg-slate-100 rounded"
          >
            Export DB
          </button>

          <label className="px-3 py-2 bg-slate-100 rounded cursor-pointer">
            Import
            <input
              type="file"
              accept="application/json"
              className="hidden"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                try {
                  await localDb.importJson(f);
                  notifySuccess("DB imported");
                  window.location.reload();
                } catch (err) {
                  notifyError(err.message || "Import failed");
                }
              }}
            />
          </label>

          <button
            onClick={handleResetDB}
            className="px-3 py-2 bg-red-100 rounded"
          >
            Reset DB
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}