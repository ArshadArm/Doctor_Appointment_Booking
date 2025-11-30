// src/usecases/user.usecase.js
import { localDb } from "../services/localDb.service";

export const userUsecase = {
  async list() {
    return await localDb.getCollection("users");
  },
  async add(user) {
    if (!user || !user.id) throw new Error("Invalid user");
    return await localDb.add("users", user);
  },
  async update(id, patch) {
    return await localDb.update("users", id, patch);
  },
  async remove(id) {
    return await localDb.remove("users", id);
  },
  async findByRole(role) {
    const all = await localDb.getCollection("users");
    return all.filter((u) => u.role === role);
  },
  async findById(id) {
    const all = await localDb.getCollection("users");
    return all.find((u) => u.id === id) || null;
  },
};