export function createUser({ id, name, role, email, specialization }) {
  return { id, name, role, email, specialization: specialization || null };
}