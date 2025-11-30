// src/pages/doctor/SubmitReport.jsx
import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { appointmentUsecase } from "../../usecases/appointment.usecase";
import { useAuth } from "../../services/auth.service";
import { localDb } from "../../services/localDb.service";
import Button from "../../components/ui/Button";
import {
  notifySuccess,
  notifyError,
} from "../../services/notification.service";
import ReportViewer from "../../components/ReportViewer";

export default function SubmitReport() {
  const { user } = useAuth();
  const [appts, setAppts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [notes, setNotes] = useState("");
  const [medicines, setMedicines] = useState([{ name: "", dose: "", qty: 1 }]);
  const [labs, setLabs] = useState([{ name: "", details: "" }]);
  const [savedReport, setSavedReport] = useState(null);

  async function load() {
    if (!user) return;
    const list = await appointmentUsecase.findByDoctor(user.id);
    setAppts(list || []);
  }

  useEffect(() => {
    load();
    window.addEventListener(localDb.DB_CHANGE_EVENT, load);
    return () => window.removeEventListener(localDb.DB_CHANGE_EVENT, load);
  }, [user?.id]);

  function changeMed(idx, key, val) {
    const copy = [...medicines];
    copy[idx][key] = val;
    setMedicines(copy);
  }
  function addMed() {
    setMedicines((s) => [...s, { name: "", dose: "", qty: 1 }]);
  }
  function removeMed(i) {
    setMedicines((s) => s.filter((_, idx) => idx !== i));
  }

  function changeLab(idx, key, val) {
    const copy = [...labs];
    copy[idx][key] = val;
    setLabs(copy);
  }
  function addLab() {
    setLabs((s) => [...s, { name: "", details: "" }]);
  }
  function removeLab(i) {
    setLabs((s) => s.filter((_, idx) => idx !== i));
  }

  async function saveReport(e) {
    e.preventDefault();
    if (!selected) return notifyError("Select an appointment");
    const report = {
      authorId: user.id,
      notes,
      medicines: medicines.filter((m) => m.name.trim() !== ""),
      labs: labs.filter((l) => l.name.trim() !== ""),
    };
    try {
      const updated = await appointmentUsecase.addReport(selected.id, report);
      notifySuccess("Report saved");
      setSavedReport(updated.report);
      // broadcast DB change
      window.dispatchEvent(new Event(localDb.DB_CHANGE_EVENT));
    } catch (err) {
      console.error(err);
      notifyError(err.message || "Failed to save report");
    }
  }

  return (
    <DashboardLayout>
      <h2 className="text-xl font-bold">Submit Report</h2>

      <div className="mt-4 bg-white p-4 rounded shadow w-full">
        <label className="block mb-2">Select Appointment</label>
        <select
          value={selected?.id ?? ""}
          onChange={(e) => {
            const v = e.target.value;
            const s = appts.find((a) => a.id === v);
            setSelected(s || null);
            setSavedReport(s?.report ?? null);
            // if loading an existing report populate fields
            if (s?.report) {
              setNotes(s.report.notes || "");
              setMedicines(
                s.report.medicines || [{ name: "", dose: "", qty: 1 }]
              );
              setLabs(s.report.labs || [{ name: "", details: "" }]);
            } else {
              setNotes("");
              setMedicines([{ name: "", dose: "", qty: 1 }]);
              setLabs([{ name: "", details: "" }]);
            }
          }}
          className="w-full p-2 border rounded mb-4"
        >
          <option value="">Select appointment</option>
          {appts.map((a) => (
            <option key={a.id} value={a.id}>
              {a.date} {a.time} — {a.reason} — {a.status}
            </option>
          ))}
        </select>

        {selected && (
          <form onSubmit={saveReport}>
            <label className="block mb-2">Clinical Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2 border rounded mb-2"
            />

            <div className="mb-2">
              <div className="font-medium">Medicines</div>
              {medicines.map((m, idx) => (
                <div key={idx} className="flex gap-2 items-center mb-2">
                  <input
                    value={m.name}
                    onChange={(e) => changeMed(idx, "name", e.target.value)}
                    placeholder="Name"
                    className="p-2 border rounded flex-1"
                  />
                  <input
                    value={m.dose}
                    onChange={(e) => changeMed(idx, "dose", e.target.value)}
                    placeholder="Dose"
                    className="p-2 border rounded w-28"
                  />
                  <input
                    value={m.qty}
                    onChange={(e) => changeMed(idx, "qty", e.target.value)}
                    placeholder="Qty"
                    type="number"
                    className="p-2 border rounded w-20"
                  />
                  <button
                    type="button"
                    onClick={() => removeMed(idx)}
                    className="px-2 py-1 border rounded"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addMed}
                className="px-2 py-1 border rounded"
              >
                Add Medicine
              </button>
            </div>

            <div className="mb-2">
              <div className="font-medium">Lab Allocations</div>
              {labs.map((l, idx) => (
                <div key={idx} className="flex gap-2 items-center mb-2">
                  <input
                    value={l.name}
                    onChange={(e) => changeLab(idx, "name", e.target.value)}
                    placeholder="Test name"
                    className="p-2 border rounded flex-1"
                  />
                  <input
                    value={l.details}
                    onChange={(e) => changeLab(idx, "details", e.target.value)}
                    placeholder="Details"
                    className="p-2 border rounded w-40"
                  />
                  <button
                    type="button"
                    onClick={() => removeLab(idx)}
                    className="px-2 py-1 border rounded"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addLab}
                className="px-2 py-1 border rounded"
              >
                Add Lab
              </button>
            </div>

            <div className="flex gap-2 justify-end mt-3">
              <Button
                type="button"
                onClick={() => {
                  setNotes("");
                  setMedicines([{ name: "", dose: "", qty: 1 }]);
                  setLabs([{ name: "", details: "" }]);
                }}
              >
                Clear
              </Button>
              <Button type="submit" className="bg-indigo-600 text-white">
                Save Report
              </Button>
            </div>
          </form>
        )}

        {savedReport && (
          <div className="mt-6">
            <h3 className="font-bold">Saved Report</h3>
            <ReportViewer report={savedReport} appointment={selected} />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}