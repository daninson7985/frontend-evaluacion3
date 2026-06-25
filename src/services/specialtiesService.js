import { getUsers } from "./userService";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const SPECIALTIES_STORAGE_KEY = "sportclub_specialties";

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

function loadLocalSpecialties() {
  try {
    const stored = localStorage.getItem(SPECIALTIES_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // ignore
  }
  return [
    { id: 1, name: "Functional Training", description: "Entrenamiento de funcionalidad física", level: "Intermedio" },
    { id: 2, name: "CrossFit", description: "Combinación de ejercicios variados", level: "Avanzado" },
    { id: 3, name: "Yoga", description: "Flexibilidad y respiración", level: "Principiante" },
  ];
}

function persistLocalSpecialties(specialties) {
  localStorage.setItem(SPECIALTIES_STORAGE_KEY, JSON.stringify(specialties));
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

export async function getSpecialties() {
  if (API_BASE) {
    try {
      const res = await fetch(`${normalizeApiBase()}/specialties`, { headers: getHeaders(false) });
      const data = await handleResponse(res, "Error obteniendo especialidades");
      return { data: data.data || data };
    } catch {
      try {
        const users = await getUsers();
        const coaches = (users.data || []).filter((user) => user.role === "coach");
        if (coaches.length > 0) {
          return {
            data: coaches.map((coach) => ({
              id: coach.id,
              name: coach.metadata?.specialty || `Especialidad de ${coach.full_name}`,
              description: coach.metadata?.specialty ? `Especialidad del coach ${coach.full_name}` : "Especialidad sin definir",
              level: coach.metadata?.specialty ? "Avanzado" : "—"
            }))
          };
        }
      } catch {
        // ignore and fallback to local specialties
      }
      return { data: loadLocalSpecialties() };
    }
  }
  return { data: loadLocalSpecialties() };
}

export async function createSpecialty(specialtyData) {
  if (API_BASE) {
    try {
      const res = await fetch(`${normalizeApiBase()}/specialties`, {
        method: "POST",
        headers: getHeaders(true),
        body: JSON.stringify(specialtyData),
      });
      const data = await handleResponse(res, "Error creando especialidad");
      return { data: data.data || data };
    } catch {
      const specialties = loadLocalSpecialties();
      const newSpecialty = { id: Date.now(), ...specialtyData };
      const updated = [...specialties, newSpecialty];
      persistLocalSpecialties(updated);
      return { data: newSpecialty };
    }
  }

  const specialties = loadLocalSpecialties();
  const newSpecialty = { id: Date.now(), ...specialtyData };
  const updated = [...specialties, newSpecialty];
  persistLocalSpecialties(updated);
  return { data: newSpecialty };
}

export async function updateSpecialty(id, specialtyData) {
  if (API_BASE) {
    try {
      const res = await fetch(`${normalizeApiBase()}/specialties/${id}`, {
        method: "PUT",
        headers: getHeaders(true),
        body: JSON.stringify(specialtyData),
      });
      const data = await handleResponse(res, "Error actualizando especialidad");
      return { data: data.data || data };
    } catch {
      const specialties = loadLocalSpecialties().map((item) => (item.id === id ? { ...item, ...specialtyData } : item));
      persistLocalSpecialties(specialties);
      return { data: specialtyData };
    }
  }

  const specialties = loadLocalSpecialties().map((item) => (item.id === id ? { ...item, ...specialtyData } : item));
  persistLocalSpecialties(specialties);
  return { data: specialtyData };
}

export async function deleteSpecialty(id) {
  if (API_BASE) {
    try {
      const res = await fetch(`${normalizeApiBase()}/specialties/${id}`, {
        method: "DELETE",
        headers: getHeaders(false),
      });
      if (res.ok) return true;
      await handleResponse(res, "Error eliminando especialidad");
    } catch {
      const specialties = loadLocalSpecialties().filter((item) => item.id !== id);
      persistLocalSpecialties(specialties);
      return true;
    }
  }

  const specialties = loadLocalSpecialties().filter((item) => item.id !== id);
  persistLocalSpecialties(specialties);
  return true;
}
