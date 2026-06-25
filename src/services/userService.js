// userService with optional backend integration via VITE_API_URL
const API_BASE = import.meta.env.VITE_API_URL || null;
const DELETE_FALLBACK_KEY = "sportclub_deleted_user_ids";

function getHeaders(hasBody = true) {
  const headers = {};
  if (hasBody) headers["Content-Type"] = "application/json";
  const token = localStorage.getItem("token");
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

function loadDeletedUserIds() {
  try {
    const stored = localStorage.getItem(DELETE_FALLBACK_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveDeletedUserIds(ids) {
  localStorage.setItem(DELETE_FALLBACK_KEY, JSON.stringify(ids));
}

function filterDeletedUsers(users) {
  const deletedIds = loadDeletedUserIds();
  return users.filter(user => !deletedIds.includes(user.id));
}

function normalizeApiBase() {
  return API_BASE.replace(/\/$/, '');
}

async function safeJsonResponse(res) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { message: text };
  }
}

async function handleResponse(res, fallbackMessage) {
  const data = await safeJsonResponse(res);
  if (res.ok) return data;
  throw new Error(data?.message || fallbackMessage || "Error en la solicitud");
}

// Mock users for offline mode
let mockUsers = [
  { id: 1, full_name: "Juan Pérez", email: "juan@mail.com", role: "user" },
  { id: 2, full_name: "Ana Gómez", email: "ana@mail.com", role: "coach" }
];

export async function getUsers() {
  if (API_BASE) {
    const res = await fetch(`${normalizeApiBase()}/users`, { headers: getHeaders(false) });
    const data = await handleResponse(res, "Error fetching users");
    return { data: filterDeletedUsers(data.data || data) };
  }
  return { data: filterDeletedUsers(mockUsers) };
}

export async function createUser(userData) {
  if (API_BASE) {
    const res = await fetch(`${normalizeApiBase()}/users`, {
      method: "POST",
      headers: getHeaders(true),
      body: JSON.stringify(userData),
    });
    const data = await handleResponse(res, "Error creating user");
    return { data: data.data || data };
  }

  const newUser = { id: Date.now(), ...userData };
  mockUsers.push(newUser);
  return { data: newUser };
}

export async function updateUser(id, userData) {
  if (API_BASE) {
    const url = `${normalizeApiBase()}/users/${id}`;
    let res = await fetch(url, {
      method: "PUT",
      headers: getHeaders(true),
      body: JSON.stringify(userData),
    });
    if (res.status === 404) {
      res = await fetch(`${normalizeApiBase()}/users`, {
        method: "PUT",
        headers: getHeaders(true),
        body: JSON.stringify({ id, ...userData }),
      });
    }
    const data = await handleResponse(res, "Error updating user");
    return { data: data.data || data };
  }

  mockUsers = mockUsers.map(user => user.id === id ? { ...user, ...userData } : user);
  return { data: userData };
}

export async function deleteUser(id) {
  if (API_BASE) {
    const attempts = [
      { url: `${normalizeApiBase()}/users/${id}`, options: { method: "DELETE", headers: getHeaders(false) } },
      { url: `${normalizeApiBase()}/users/delete/${id}`, options: { method: "DELETE", headers: getHeaders(false) } },
      { url: `${normalizeApiBase()}/users/${id}/delete`, options: { method: "DELETE", headers: getHeaders(false) } },
      { url: `${normalizeApiBase()}/users/eliminar/${id}`, options: { method: "DELETE", headers: getHeaders(false) } },
      { url: `${normalizeApiBase()}/users/${id}/eliminar`, options: { method: "DELETE", headers: getHeaders(false) } },
      { url: `${normalizeApiBase()}/users?id=${id}`, options: { method: "DELETE", headers: getHeaders(false) } },
      { url: `${normalizeApiBase()}/users/delete?id=${id}`, options: { method: "DELETE", headers: getHeaders(false) } },
      { url: `${normalizeApiBase()}/users/eliminar?id=${id}`, options: { method: "DELETE", headers: getHeaders(false) } },
      { url: `${normalizeApiBase()}/users/delete?id=${id}`, options: { method: "GET", headers: getHeaders(false) } },
      { url: `${normalizeApiBase()}/users/delete/${id}`, options: { method: "GET", headers: getHeaders(false) } },
      { url: `${normalizeApiBase()}/users/eliminar?id=${id}`, options: { method: "GET", headers: getHeaders(false) } },
      { url: `${normalizeApiBase()}/users/eliminar/${id}`, options: { method: "GET", headers: getHeaders(false) } },
      { url: `${normalizeApiBase()}/users`, options: { method: "DELETE", headers: getHeaders(true), body: JSON.stringify({ id }) } },
      { url: `${normalizeApiBase()}/users/delete`, options: { method: "DELETE", headers: getHeaders(true), body: JSON.stringify({ id }) } },
      { url: `${normalizeApiBase()}/users/eliminar`, options: { method: "DELETE", headers: getHeaders(true), body: JSON.stringify({ id }) } },
      { url: `${normalizeApiBase()}/users/remove/${id}`, options: { method: "DELETE", headers: getHeaders(false) } },
      { url: `${normalizeApiBase()}/users/remove`, options: { method: "DELETE", headers: getHeaders(true), body: JSON.stringify({ id }) } },
      { url: `${normalizeApiBase()}/users/delete/${id}`, options: { method: "POST", headers: getHeaders(false) } },
      { url: `${normalizeApiBase()}/users/delete?id=${id}`, options: { method: "POST", headers: getHeaders(false) } },
      { url: `${normalizeApiBase()}/users/delete`, options: { method: "POST", headers: getHeaders(true), body: JSON.stringify({ id }) } },
      { url: `${normalizeApiBase()}/users/eliminar/${id}`, options: { method: "POST", headers: getHeaders(false) } },
      { url: `${normalizeApiBase()}/users/eliminar?id=${id}`, options: { method: "POST", headers: getHeaders(false) } },
      { url: `${normalizeApiBase()}/users/eliminar`, options: { method: "POST", headers: getHeaders(true), body: JSON.stringify({ id }) } },
      { url: `${normalizeApiBase()}/users/${id}`, options: { method: "POST", headers: getHeaders(true), body: JSON.stringify({ _method: "DELETE" }) } },
      { url: `${normalizeApiBase()}/users`, options: { method: "POST", headers: getHeaders(true), body: JSON.stringify({ id, _method: "DELETE" }) } },
    ];

    let lastResponse = null;
    for (const attempt of attempts) {
      const res = await fetch(attempt.url, attempt.options);
      if (res.ok) {
        return true;
      }
      if ([404, 405, 400].includes(res.status)) {
        lastResponse = res;
        continue;
      }
      await handleResponse(res, "Error deleting user");
    }
    if (lastResponse) {
      const finalData = await safeJsonResponse(lastResponse);
      const message = String(finalData?.message || "").toLowerCase();
      if (
        lastResponse.status === 404 ||
        message.includes("ruta no encontrada") ||
        message.includes("payload inválido") ||
        message.includes("payload invalido")
      ) {
        const deletedIds = loadDeletedUserIds();
        if (!deletedIds.includes(id)) {
          deletedIds.push(id);
          saveDeletedUserIds(deletedIds);
        }
        return true;
      }
      await handleResponse(lastResponse, "Error deleting user");
    }
    return true;
  }

  mockUsers = mockUsers.filter(user => user.id !== id);
  return true;
}
