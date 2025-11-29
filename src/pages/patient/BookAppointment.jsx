import React from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { localDb } from "../../services/localDb.service";
import { appointmentUsecase } from "../../usecases/appointment.usecase";
import { useAuth } from "../../services/auth.service";
import { v4 as uuidv4 } from "uuid";

export default function BookAppointment() {
  const { user } = useAuth();
  const doctors = localDb
    .getCollection("users")
    .filter((u) => u.role === "doctor");

  function book(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    const appointment = {
      id: "apt-" + uuidv4(),
      patientId: user.id,
      doctorId: fd.get("doctorId"),
      date: fd.get("date"),
      time: fd.get("time"),
      reason: fd.get("reason"),
      status: "scheduled",
    };
    appointmentUsecase.add(appointment);
    alert("Booked!");
  }

  return (
    <DashboardLayout>
      <h2 className="text-xl font-bold">Book Appointment</h2>
      <form onSubmit={book} className="mt-4 bg-white p-4 rounded shadow w-96">
        <label className="block mb-2">Doctor</label>
        <select name="doctorId" className="w-full p-2 border rounded mb-2">
          {doctors.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name} — {d.specialization}
            </option>
          ))}
        </select>
        <label className="block mb-2">Date</label>
        <input
          name="date"
          type="date"
          className="w-full p-2 border rounded mb-2"
        />
        <label className="block mb-2">Time</label>
        <input
          name="time"
          type="time"
          className="w-full p-2 border rounded mb-2"
        />
        <label className="block mb-2">Reason</label>
        <input name="reason" className="w-full p-2 border rounded mb-2" />
        <div className="mt-2">
          <button className="px-3 py-2 bg-indigo-600 text-white rounded">
            Book
          </button>
        </div>
      </form>
    </DashboardLayout>
  );
}