// src/pages/patient/BookAppointment.jsx
import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { localDb } from "../../services/localDb.service";
import { appointmentUsecase } from "../../usecases/appointment.usecase";
import { useAuth } from "../../services/auth.service";
import { v4 as uuidv4 } from "uuid";
import { required, isDateInPast } from "../../utils/validators";
import {
  notifySuccess,
  notifyError,
} from "../../services/notification.service";

export default function BookAppointment() {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      const u = await localDb.getCollection("users");
      if (mounted) setDoctors(u.filter((x) => x.role === "doctor"));
    }
    load();
    return () => (mounted = false);
  }, []);

  async function book(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    const doctorId = fd.get("doctorId");
    const date = fd.get("date");
    const time = fd.get("time");
    const reason = fd.get("reason");

    // validation
    if (
      !required(doctorId) ||
      !required(date) ||
      !required(time) ||
      !required(reason)
    ) {
      return notifyError("All fields are required");
    }
    if (isDateInPast(date)) return notifyError("Date cannot be in the past");

    const appointment = {
      id: "apt-" + uuidv4(),
      patientId: user.id,
      doctorId,
      date,
      time,
      reason,
      status: "scheduled",
    };

    try {
      await appointmentUsecase.add(appointment);
      notifySuccess("Appointment booked");
      e.target.reset();
    } catch (err) {
      console.error(err);
      notifyError(err.message || "Failed to book");
    }
  }

  return (
    <DashboardLayout>
      <h2 className="text-xl font-bold">Book Appointment</h2>
      <form onSubmit={book} className="mt-4 bg-white p-4 rounded shadow w-96">
        <label className="block mb-2">Doctor</label>
        <select name="doctorId" className="w-full p-2 border rounded mb-2">
          <option value="">Select doctor</option>
          {doctors.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name} — {d.specialization ?? "—"}
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