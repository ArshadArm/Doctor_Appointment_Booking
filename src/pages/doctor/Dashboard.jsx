import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { appointmentUsecase } from "../../usecases/appointment.usecase";
import { useAuth } from "../../services/auth.service";
import { localDb } from "../../services/localDb.service";

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [appts, setAppts] = useState([]);

  async function load() {
    if (!user) return setAppts([]);

    const list = await appointmentUsecase.findByDoctor(user.id);
    setAppts(Array.isArray(list) ? list : []);
  }

  useEffect(() => {
    load();
    window.addEventListener(localDb.DB_CHANGE_EVENT, load);
    return () => window.removeEventListener(localDb.DB_CHANGE_EVENT, load);
  }, [user?.id]);

  return (
    <DashboardLayout>
      <h2 className="text-xl font-bold">Welcome, {user?.name}</h2>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          Upcoming
          <br />
          <div className="text-2xl font-bold">{appts.length}</div>
        </div>
      </div>

      <div className="mt-4 bg-white p-4 rounded shadow">
        <h3 className="font-bold mb-2">Today's Appointments</h3>

        {appts.length === 0 && (
          <div className="text-slate-500 mt-2">No appointments for today.</div>
        )}

        <ul>
          {appts.map((a) => (
            <li key={a.id} className="py-2 border-b">
              {a.date} {a.time} — {a.reason}
            </li>
          ))}
        </ul>
      </div>
    </DashboardLayout>
  );
}