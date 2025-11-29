// A tiny local DB stored in localStorage under `__dab_db__`
const STORAGE_KEY = "__dab_db__";

// ------------------------------
// Default DB with initial users
// ------------------------------
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

// ------------------------------
// Read DB safely from localStorage
// ------------------------------
function readDB() {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    writeDB(defaultDb);
    return structuredClone(defaultDb);
  }

  try {
    const parsed = JSON.parse(raw);

    // Auto-fix missing or invalid collections
    const users = Array.isArray(parsed.users)
      ? parsed.users
      : structuredClone(defaultDb.users);
    const appointments = Array.isArray(parsed.appointments)
      ? parsed.appointments
      : [];

    // Ensure at least default users exist
    if (users.length === 0) users.push(...structuredClone(defaultDb.users));

    return { users, appointments };
  } catch (e) {
    console.error("DB parse error, resetting DB", e);
    writeDB(defaultDb);
    return structuredClone(defaultDb);
  }
}

// ------------------------------
// Write DB safely to localStorage
// ------------------------------
function writeDB(db) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

// ------------------------------
// Local DB API
// ------------------------------
export const localDb = {
  getCollection(name) {
    const db = readDB();
    return db[name] || [];
  },

  setCollection(name, items) {
    const db = readDB();
    db[name] = Array.isArray(items) ? items : [];
    writeDB(db);
  },

  add(name, item) {
    const db = readDB();
    db[name] = db[name] || [];
    db[name].push(item);
    writeDB(db);
  },

  update(name, id, patch) {
    const db = readDB();
    db[name] = db[name].map((it) => (it.id === id ? { ...it, ...patch } : it));
    writeDB(db);
  },

  remove(name, id) {
    const db = readDB();
    db[name] = db[name].filter((it) => it.id !== id);
    writeDB(db);
  },

  exportJson(filename = "dab-db.json") {
    const db = readDB();
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
      alert("Invalid JSON file");
      console.error("Failed to parse JSON", e);
      return;
    }

    const users = Array.isArray(parsed.users)
      ? parsed.users
      : structuredClone(defaultDb.users);
    const appointments = Array.isArray(parsed.appointments)
      ? parsed.appointments
      : [];

    // Ensure at least default users
    if (users.length === 0) users.push(...structuredClone(defaultDb.users));

    writeDB({ users, appointments });
  },

  clear() {
    writeDB(structuredClone(defaultDb));
  },
};