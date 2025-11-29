export function createAppointment({
  id,
  patientId,
  doctorId,
  date,
  time,
  reason,
  status,
}) {
  return {
    id,
    patientId,
    doctorId,
    date,
    time,
    reason,
    status: status || "scheduled",
  };
}