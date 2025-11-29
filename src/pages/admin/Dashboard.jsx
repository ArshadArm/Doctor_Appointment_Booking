import React from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { localDb } from "../../services/localDb.service";

export default function AdminDashboard() {
  const users = localDb.getCollection("users");
  const appts = localDb.getCollection("appointments");
  const doctors = users.filter((u) => u.role === "doctor");
  const patients = users.filter((u) => u.role === "patient");

  // Handler for resetting DB safely
  const handleResetDB = () => {
    const confirmReset = window.confirm(
      "Are you sure you want to reset the database? This will restore default users (Admin, Doctor, Patient)."
    );
    if (confirmReset) {
      localDb.clear();
      window.location.reload();
    }
  };

  return (
    <DashboardLayout>
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded shadow">
          Doctors
          <br />
          <div className="text-2xl font-bold">{doctors.length}</div>
        </div>
        <div className="p-4 bg-white rounded shadow">
          Patients
          <br />
          <div className="text-2xl font-bold">{patients.length}</div>
        </div>
        <div className="p-4 bg-white rounded shadow">
          Appointments
          <br />
          <div className="text-2xl font-bold">{appts.length}</div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-white rounded shadow">
        <h3 className="font-bold mb-2">Database</h3>
        <div className="flex gap-2">
          {/* Export DB button */}
          <button
            onClick={() => localDb.exportJson()}
            className="px-3 py-2 bg-slate-100 rounded"
          >
            Export DB
          </button>

          {/* Import DB button */}
          <label className="px-3 py-2 bg-slate-100 rounded cursor-pointer">
            Import
            <input
              type="file"
              accept="application/json"
              className="hidden"
              onChange={async (e) => {
                const f = e.target.files[0];
                if (f) await localDb.importJson(f);
                window.location.reload();
              }}
            />
          </label>

          {/* Reset DB button with confirmation */}
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