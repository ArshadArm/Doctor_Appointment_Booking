// src/usecases/appointment.usecase.js
import { localDb } from "../services/localDb.service";
import { isDateInPast, isDateToday } from "../utils/validators";

export const appointmentUsecase = {
  async list() {
    const list = await localDb.getCollection("appointments");
    return Array.isArray(list) ? list : [];
  },

  async add(apt) {
    if (!apt || typeof apt !== "object") throw new Error("Invalid appointment");
    if (!apt.id) throw new Error("Appointment must include id");
    if (!apt.patientId) throw new Error("Appointment must include patientId");
    if (!apt.date) throw new Error("Appointment must include date");

    // Do not allow past dates
    if (isDateInPast(apt.date))
      throw new Error("Cannot book an appointment in the past");

    // Disallow same-day bookings (business rule requested)
    if (isDateToday(apt.date))
      throw new Error(
        "Same-day appointments are not allowed. Please choose a future date."
      );

    // Prevent same patient having more than one appointment on the same date
    const all = await localDb.getCollection("appointments");
    const hasConflict = (Array.isArray(all) ? all : []).some(
      (a) => a.patientId === apt.patientId && a.date === apt.date
    );
    if (hasConflict)
      throw new Error("You already have an appointment on this date.");

    return await localDb.add("appointments", apt);
  },

  async update(id, patch) {
    if (!id) throw new Error("Missing appointment id");
    // If date or patientId changing, ensure we don't create duplicate for patient/date
    if (patch && (patch.date || patch.patientId)) {
      const all = await localDb.getCollection("appointments");
      const target = all.find((a) => a.id === id);
      if (!target) throw new Error("Appointment not found");
      const newDate = patch.date ?? target.date;
      const newPatient = patch.patientId ?? target.patientId;

      // prevent same-day booking via admin/doctor change if business rule applies
      // (we only block if the new date is today)
      if (isDateToday(newDate))
        throw new Error("Same-day appointments are not allowed.");

      const conflict = all.some(
        (a) => a.id !== id && a.patientId === newPatient && a.date === newDate
      );
      if (conflict)
        throw new Error(
          "That patient already has an appointment on that date."
        );
    }

    return await localDb.update("appointments", id, patch);
  },

  async remove(id) {
    if (!id) throw new Error("Missing appointment id");
    return await localDb.remove("appointments", id);
  },

  async findByDoctor(doctorId) {
    const all = await localDb.getCollection("appointments");
    return Array.isArray(all) ? all.filter((a) => a.doctorId === doctorId) : [];
  },

  async findByPatient(patientId) {
    const all = await localDb.getCollection("appointments");
    return Array.isArray(all)
      ? all.filter((a) => a.patientId === patientId)
      : [];
  },

  // ---- report helpers ----
  // report structure: { notes, medicines: [{name,dose,qty}], labs: [{name,details}], authorId, createdAt }
  async addReport(appointmentId, report) {
    if (!appointmentId) throw new Error("Missing appointment id");
    if (!report || typeof report !== "object")
      throw new Error("Invalid report");
    const updated = await localDb.update("appointments", appointmentId, {
      report: { ...report, createdAt: new Date().toISOString() },
    });
    return updated;
  },

  async getReport(appointmentId) {
    const all = await localDb.getCollection("appointments");
    const apt = all.find((a) => a.id === appointmentId);
    return apt ? apt.report || null : null;
  },
};