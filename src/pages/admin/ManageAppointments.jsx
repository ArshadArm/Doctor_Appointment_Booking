// src/pages/admin/ManageAppointments.jsx
import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { appointmentUsecase } from "../../usecases/appointment.usecase";
import { userUsecase } from "../../usecases/user.usecase";
import { localDb } from "../../services/localDb.service";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import {
  notifySuccess,
  notifyError,
} from "../../services/notification.service";

export default function ManageAppointments() {
  const [list, setList] = useState([]);
  const [users, setUsers] = useState([]);
  const [editing, setEditing] = useState(null);

  async function load() {
    const appts = await appointmentUsecase.list();
    setList(Array.isArray(appts) ? appts : []);
    const u = await userUsecase.list();
    setUsers(u);
  }

  useEffect(() => {
    load();
    window.addEventListener(localDb.DB_CHANGE_EVENT, load);
    return () => window.removeEventListener(localDb.DB_CHANGE_EVENT, load);
  }, []);

  async function onSave(e) {
    e.preventDefault();
    if (!editing) return;
    const fd = new FormData(e.target);
    const patch = {
      patientId: fd.get("patientId"),
      doctorId: fd.get("doctorId"),
      date: fd.get("date"),
      time: fd.get("time"),
      status: fd.get("status"),
    };
    try {
      await appointmentUsecase.update(editing.id, patch);
      notifySuccess("Appointment updated");
      setEditing(null);
      load();
    } catch (err) {
      console.error(err);
      notifyError(err.message || "Failed to update");
    }
  }

  async function onDelete(id) {
    if (!window.confirm("Delete this appointment?")) return;
    try {
      await appointmentUsecase.remove(id);
      notifySuccess("Deleted");
      load();
    } catch (err) {
      console.error(err);
      notifyError("Failed to delete");
    }
  }

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Manage Appointments</h2>
      </div>

      <div className="bg-white rounded shadow p-4">
        {list.length === 0 && <div>No appointments</div>}
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
              <Button onClick={() => setEditing(a)}>Edit</Button>
              <Button onClick={() => onDelete(a.id)} className="bg-red-100">
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <form onSubmit={onSave} className="bg-white p-6 rounded w-96">
            <h3 className="font-bold mb-2">Edit Appointment</h3>

            <label className="block mb-2">Patient</label>
            <select
              name="patientId"
              defaultValue={editing.patientId}
              className="w-full p-2 border rounded mb-2"
            >
              <option value="">Select patient</option>
              {users
                .filter((u) => u.role === "patient")
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — {p.email}
                  </option>
                ))}
            </select>

            <label className="block mb-2">Doctor</label>
            <select
              name="doctorId"
              defaultValue={editing.doctorId}
              className="w-full p-2 border rounded mb-2"
            >
              <option value="">Select doctor</option>
              {users
                .filter((u) => u.role === "doctor")
                .map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} — {d.specialization}
                  </option>
                ))}
            </select>

            <Input
              name="date"
              label="Date"
              type="date"
              defaultValue={editing.date}
            />
            <Input
              name="time"
              label="Time"
              type="time"
              defaultValue={editing.time}
            />

            <label className="block mb-2">Status</label>
            <select
              name="status"
              defaultValue={editing.status}
              className="w-full p-2 border rounded mb-2"
            >
              <option value="scheduled">scheduled</option>
              <option value="done">done</option>
              <option value="cancelled">cancelled</option>
            </select>

            <div className="mt-3 flex justify-end gap-2">
              <Button type="button" onClick={() => setEditing(null)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-indigo-600 text-white">
                Save
              </Button>
            </div>
          </form>
        </div>
      )}
    </DashboardLayout>
  );
}