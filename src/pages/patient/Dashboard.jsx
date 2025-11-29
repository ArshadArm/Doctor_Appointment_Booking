import React from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../services/auth.service";
import { appointmentUsecase } from "../../usecases/appointment.usecase";

export default function PatientDashboard() {
  const { user } = useAuth();
  const my = appointmentUsecase.findByPatient(user.id);

  return (
    <DashboardLayout>
      <h2 className="text-xl font-bold">Hello, {user.name}</h2>
      <div className="mt-4 bg-white p-4 rounded shadow">
        <h3 className="font-bold">My Appointments</h3>
        {my.map((a) => (
          <div key={a.id} className="py-2 border-b">
            {a.date} {a.time} — {a.status}
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}