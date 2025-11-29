import { localDb } from "../services/localDb.service";

export const appointmentUsecase = {
  list() {
    return localDb.getCollection("appointments");
  },
  add(apt) {
    localDb.add("appointments", apt);
  },
  update(id, patch) {
    localDb.update("appointments", id, patch);
  },
  remove(id) {
    localDb.remove("appointments", id);
  },
  findByDoctor(doctorId) {
    return localDb
      .getCollection("appointments")
      .filter((a) => a.doctorId === doctorId);
  },
  findByPatient(patientId) {
    return localDb
      .getCollection("appointments")
      .filter((a) => a.patientId === patientId);
  },
};