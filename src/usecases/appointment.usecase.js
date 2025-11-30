// src/usecases/appointment.usecase.js
import { localDb } from "../services/localDb.service";

export const appointmentUsecase = {
  async list() {
    const list = await localDb.getCollection("appointments");
    return Array.isArray(list) ? list : [];
  },

  async add(apt) {
    if (!apt || typeof apt !== "object") throw new Error("Invalid appointment");
    if (!apt.id) throw new Error("Appointment must include id");
    return await localDb.add("appointments", apt);
  },

  async update(id, patch) {
    if (!id) throw new Error("Missing appointment id");
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
};