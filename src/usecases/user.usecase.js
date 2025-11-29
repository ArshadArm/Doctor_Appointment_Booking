import { localDb } from "../services/localDb.service";

export const userUsecase = {
  list() {
    return localDb.getCollection("users");
  },
  add(user) {
    localDb.add("users", user);
  },
  update(id, patch) {
    localDb.update("users", id, patch);
  },
  remove(id) {
    localDb.remove("users", id);
  },
};