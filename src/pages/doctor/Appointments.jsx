import React from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { appointmentUsecase } from "../../usecases/appointment.usecase";
import { useAuth } from "../../services/auth.service";

export default function DoctorAppointments() {
  const { user } = useAuth();
  const [list, setList] = React.useState(
    appointmentUsecase.findByDoctor(user.id)
  );

  function updateStatus(id, status) {
    appointmentUsecase.update(id, { status });
    setList(appointmentUsecase.findByDoctor(user.id));
  }

  return (
    <DashboardLayout>
      <h2 className="text-xl font-bold">Appointments</h2>
      <div className="mt-4 bg-white p-4 rounded shadow">
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