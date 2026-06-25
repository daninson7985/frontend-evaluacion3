const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const CLASSES_STORAGE_KEY = "sportclub_classes";

function getHeaders(hasBody = true) {
  const headers = {};
  if (hasBody) headers["Content-Type"] = "application/json";
  const token = localStorage.getItem("token");
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

function normalizeApiBase() {
  return API_BASE ? API_BASE.replace(/\/$/, '') : "";
}

function loadLocalClasses() {
  try {
    const stored = localStorage.getItem(CLASSES_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // ignore
  }
  return [
    { id: 1, name: "Circuito funcional", schedule: "Lunes 18:00", coach: "Laura Pérez", capacity: 15 },
    { id: 2, name: "Entrenamiento de fuerza", schedule: "Miércoles 19:30", coach: "Carlos Ruiz", capacity: 18 },
    { id: 3, name: "Clase de HIIT", schedule: "Viernes 17:00", coach: "Marta Gómez", capacity: 20 },
  ];
}

function persistLocalClasses(classes) {
  localStorage.setItem(CLASSES_STORAGE_KEY, JSON.stringify(classes));
}

function safeJsonResponse(res) {
  return res.text().then((text) => {
    try {
      return text ? JSON.parse(text) : {};
    } catch {
      return { message: text };
    }
  });
}

async function handleResponse(res, fallbackMessage) {
  const data = await safeJsonResponse(res);
  if (res.ok) return data;
  throw new Error(data?.message || fallbackMessage || "Error en la solicitud");
}

export async function getClasses() {
  if (API_BASE) {
    try {
      const res = await fetch(`${normalizeApiBase()}/classes`, { headers: getHeaders(false) });
      const data = await handleResponse(res, "Error obteniendo clases");
      return { data: data.data || data };
    } catch {
      return { data: loadLocalClasses() };
    }
  }
  return { data: loadLocalClasses() };
}

export async function createClass(classData) {
  if (API_BASE) {
    try {
      const res = await fetch(`${normalizeApiBase()}/classes`, {
        method: "POST",
        headers: getHeaders(true),
        body: JSON.stringify(classData),
      });
      const data = await handleResponse(res, "Error creando clase");
      return { data: data.data || data };
    } catch {
      const classes = loadLocalClasses();
      const newClass = { id: Date.now(), ...classData };
      const updated = [...classes, newClass];
      persistLocalClasses(updated);
      return { data: newClass };
    }
  }

  const classes = loadLocalClasses();
  const newClass = { id: Date.now(), ...classData };
  const updated = [...classes, newClass];
  persistLocalClasses(updated);
  return { data: newClass };
}

export async function updateClass(id, classData) {
  if (API_BASE) {
    try {
      const res = await fetch(`${normalizeApiBase()}/classes/${id}`, {
        method: "PUT",
        headers: getHeaders(true),
        body: JSON.stringify(classData),
      });
      const data = await handleResponse(res, "Error actualizando clase");
      return { data: data.data || data };
    } catch {
      const classes = loadLocalClasses().map((item) => (item.id === id ? { ...item, ...classData } : item));
      persistLocalClasses(classes);
      return { data: classData };
    }
  }

  const classes = loadLocalClasses().map((item) => (item.id === id ? { ...item, ...classData } : item));
  persistLocalClasses(classes);
  return { data: classData };
}

export async function deleteClass(id) {
  if (API_BASE) {
    try {
      const res = await fetch(`${normalizeApiBase()}/classes/${id}`, {
        method: "DELETE",
        headers: getHeaders(false),
      });
      if (res.ok) return true;
      await handleResponse(res, "Error eliminando clase");
    } catch {
      const classes = loadLocalClasses().filter((item) => item.id !== id);
      persistLocalClasses(classes);
      return true;
    }
  }

  const classes = loadLocalClasses().filter((item) => item.id !== id);
  persistLocalClasses(classes);
  return true;
}
