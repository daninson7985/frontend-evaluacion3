import { getUsers } from "./userService";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const SPORTS_STORAGE_KEY = "sportclub_sports";

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

function loadLocalSports() {
  try {
    const stored = localStorage.getItem(SPORTS_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // ignore
  }
  return [];
}

function persistLocalSports(sports) {
  localStorage.setItem(SPORTS_STORAGE_KEY, JSON.stringify(sports));
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

export async function getSports() {
  if (API_BASE) {
    try {
      const res = await fetch(`${normalizeApiBase()}/sports`, { headers: getHeaders(false) });
      const data = await handleResponse(res, "Error obteniendo deportes");
      const sports = data.data || data;
      persistLocalSports(sports);
      return { data: sports };
    } catch (error) {
      // Si hay error de conexión, devolver datos guardados o array vacío
      const saved = loadLocalSports();
      return { data: saved };
    }
  }
  return { data: loadLocalSports() };
}

export async function createSport(sportData) {
  if (API_BASE) {
    try {
      const res = await fetch(`${normalizeApiBase()}/sports`, {
        method: "POST",
        headers: getHeaders(true),
        body: JSON.stringify(sportData),
      });
      const data = await handleResponse(res, "Error creando deporte");
      return { data: data.data || data };
    } catch {
      const sports = loadLocalSports();
      const newSport = { id: Date.now(), ...sportData, created_at: new Date().toISOString() };
      const updated = [...sports, newSport];
      persistLocalSports(updated);
      return { data: newSport };
    }
  }

  const sports = loadLocalSports();
  const newSport = { id: Date.now(), ...sportData, created_at: new Date().toISOString() };
  const updated = [...sports, newSport];
  persistLocalSports(updated);
  return { data: newSport };
}

export async function updateSport(id, sportData) {
  if (API_BASE) {
    try {
      const res = await fetch(`${normalizeApiBase()}/sports/${id}`, {
        method: "PUT",
        headers: getHeaders(true),
        body: JSON.stringify(sportData),
      });
      const data = await handleResponse(res, "Error actualizando deporte");
      return { data: data.data || data };
    } catch {
      const sports = loadLocalSports().map((s) => (s.id === id ? { ...s, ...sportData } : s));
      persistLocalSports(sports);
      return { data: sportData };
    }
  }

  const sports = loadLocalSports().map((s) => (s.id === id ? { ...s, ...sportData } : s));
  persistLocalSports(sports);
  return { data: sportData };
}

export async function deleteSport(id) {
  if (API_BASE) {
    try {
      const res = await fetch(`${normalizeApiBase()}/sports/${id}`, {
        method: "DELETE",
        headers: getHeaders(false),
      });
      if (res.ok) return true;
      await handleResponse(res, "Error eliminando deporte");
    } catch {
      const sports = loadLocalSports().filter((s) => s.id !== id);
      persistLocalSports(sports);
      return true;
    }
  }

  const sports = loadLocalSports().filter((s) => s.id !== id);
  persistLocalSports(sports);
  return true;
}

export async function changeSportStatus(id, status) {
  if (API_BASE) {
    try {
      const res = await fetch(`${normalizeApiBase()}/sports/${id}/status`, {
        method: "PATCH",
        headers: getHeaders(true),
        body: JSON.stringify({ status }),
      });
      const data = await handleResponse(res, "Error actualizando estado");
      return { data: data.data || data };
    } catch {
      const sports = loadLocalSports().map((s) => (s.id === id ? { ...s, status } : s));
      persistLocalSports(sports);
      return { data: { id, status } };
    }
  }

  const sports = loadLocalSports().map((s) => (s.id === id ? { ...s, status } : s));
  persistLocalSports(sports);
  return { data: { id, status } };
}
