// src/services/localDb.service.js
// Tiny local DB stored in localStorage with async-friendly API and change events.

const STORAGE_KEY = "__dab_db__";
const DB_CHANGE_EVENT = "dab_db_change";

const defaultDb = {
  users: [
    {
      id: "1",
      name: "Admin User",
      role: "admin",
      email: "admin@example.com",
      password: "admin123",
    },
    {
      id: "2",
      name: "Doctor User",
      role: "doctor",
      email: "doctor@example.com",
      password: "doctor123",
      specialization: "General",
    },
    {
      id: "3",
      name: "Patient User",
      role: "patient",
      email: "patient@example.com",
      password: "patient123",
    },
  ],
  appointments: [],
};

function readRaw() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultDb));
    return structuredClone(defaultDb);
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error("localDb parse error:", e);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultDb));
    return structuredClone(defaultDb);
  }
}

function writeRaw(db) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  window.dispatchEvent(new Event(DB_CHANGE_EVENT));
}

// small delay to mimic async operations
function delay(ms = 120) {
  return new Promise((res) => setTimeout(res, ms));
}

export const localDb = {
  DB_CHANGE_EVENT,

  async getCollection(name) {
    await delay();
    const db = readRaw();
    return Array.isArray(db[name]) ? structuredClone(db[name]) : [];
  },

  async setCollection(name, items) {
    await delay();
    const db = readRaw();
    db[name] = Array.isArray(items) ? items : [];
    writeRaw(db);
    return structuredClone(db[name]);
  },

  async add(name, item) {
    if (!item || typeof item !== "object") throw new Error("Invalid item");
    await delay();
    const db = readRaw();
    db[name] = db[name] || [];
    db[name].push(item);
    writeRaw(db);
    return item;
  },

  async update(name, id, patch) {
    if (!id) throw new Error("Missing id");
    await delay();
    const db = readRaw();
    db[name] = (db[name] || []).map((it) =>
      it.id === id ? { ...it, ...patch } : it
    );
    writeRaw(db);
    return db[name].find((it) => it.id === id) || null;
  },

  async remove(name, id) {
    await delay();
    const db = readRaw();
    db[name] = (db[name] || []).filter((it) => it.id !== id);
    writeRaw(db);
    return true;
  },

  async exportJson(filename = "dab-db.json") {
    const db = readRaw();
    const blob = new Blob([JSON.stringify(db, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  },

  async importJson(file) {
    const txt = await file.text();
    let parsed;
    try {
      parsed = JSON.parse(txt);
    } catch (e) {
      throw new Error("Invalid JSON file");
    }
    const users = Array.isArray(parsed.users)
      ? parsed.users
      : structuredClone(defaultDb.users);
    const appointments = Array.isArray(parsed.appointments)
      ? parsed.appointments
      : [];
    if (users.length === 0) users.push(...structuredClone(defaultDb.users));
    writeRaw({ users, appointments });
    return true;
  },

  async clear() {
    await delay();
    writeRaw(structuredClone(defaultDb));
  },

  // synchronous getter used in some places for initial render (keeps compatibility)
  _readSync() {
    return readRaw();
  },
};