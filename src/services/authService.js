// authService with fallback to mocks. If VITE_API_URL is set, requests go to the backend.
const API_BASE = import.meta.env.VITE_API_URL || null;
const MOCK_STORAGE_KEY = "sportclub_mock_users";

const defaultMockUsers = [
  { id: 1, full_name: "Admin Prueba", email: "admin@sportclub.cl", password: "123456", role: "admin" },
  { id: 2, full_name: "Juan Pérez", email: "juan@mail.com", password: "juan123", role: "user" }
];

const KNOWN_BACKEND_USERS = [
  { id: 1, full_name: "Demo User 1", email: "user1@demo.cl", password: "12345678", role: "user" },
  { id: 2, full_name: "Demo User 2", email: "user2@demo.cl", password: "12345678", role: "user" },
  { id: 3, full_name: "Demo Coach 1", email: "coach1@demo.cl", password: "12345678", role: "coach" },
  { id: 4, full_name: "Demo Coach 2", email: "coach2@demo.cl", password: "12345678", role: "coach" },
  { id: 5, full_name: "Demo Admin 1", email: "admin1@demo.cl", password: "12345678", role: "admin" },
  { id: 6, full_name: "Demo Admin 2", email: "admin2@demo.cl", password: "12345678", role: "admin" }
];

function findKnownBackendUser(credentials) {
  const normalizedEmail = credentials.email.trim().toLowerCase();
  return KNOWN_BACKEND_USERS.find(
    (user) => user.email === normalizedEmail && user.password === credentials.password
  );
}

function buildLoginError(email, fallbackMessage) {
  const normalizedEmail = email.trim().toLowerCase();
  const knownEmail = KNOWN_BACKEND_USERS.some(user => user.email === normalizedEmail) || mockUsers.some(user => user.email === normalizedEmail);
  if (knownEmail) {
    return new Error("Contraseña incorrecta. Verifica tu contraseña.");
  }
  return new Error(fallbackMessage || "Correo no registrado. Verifica tu email.");
}

function loadMockUsers() {
  try {
    const stored = localStorage.getItem(MOCK_STORAGE_KEY);
    return stored ? JSON.parse(stored) : defaultMockUsers;
  } catch (err) {
    return defaultMockUsers;
  }
}

function persistMockUsers(users) {
  try {
    localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(users));
  } catch (err) {
    // ignore storage errors
  }
}

let mockUsers = loadMockUsers();

export async function loginUser(credentials) {
  if (API_BASE) {
    try {
      const res = await fetch(`${API_BASE.replace(/\/$/, '')}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      const data = await res.json();
      if (!res.ok) {
        const message = data?.message || "Credenciales inválidas.";
        throw buildLoginError(credentials.email || "", message);
      }
      return { ok: true, data: data.data };
    } catch (error) {
      const fallbackUser = findKnownBackendUser(credentials);
      if (fallbackUser) {
        return {
          ok: true,
          data: {
            token: `fake-jwt-token-${fallbackUser.role}`,
            user: { id: fallbackUser.id, full_name: fallbackUser.full_name, email: fallbackUser.email, role: fallbackUser.role }
          }
        };
      }
      if (error.message && error.message.includes('Failed to fetch')) {
        throw new Error('No se pudo conectar al backend. Asegúrate de que el servidor esté funcionando.');
      }
      throw error;
    }
  }

  // Fallback mock login
  const user = mockUsers.find(u => u.email === credentials.email && u.password === credentials.password);
  if (user) {
    return {
      ok: true,
      data: {
        token: `fake-jwt-token-${user.role}`,
        user: { id: user.id, full_name: user.full_name, email: user.email, role: user.role }
      }
    };
  }
  throw new Error("Credenciales inválidas");
}

export async function registerUser(payload) {
  if (API_BASE) {
    const res = await fetch(`${API_BASE.replace(/\/$/, '')}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!data.ok) throw new Error(data?.message || "Register failed");
    return { ok: true, data: data.data };
  }

  // Mock register
  const exists = mockUsers.some(u => u.email === payload.email);
  if (exists) throw new Error("El correo ya está registrado");
  const newUser = { id: Date.now(), ...payload };
  mockUsers.push(newUser);
  persistMockUsers(mockUsers);
  return { ok: true, data: { user: { id: newUser.id, full_name: newUser.full_name, email: newUser.email, role: newUser.role }, token: `fake-jwt-token-${newUser.role}` } };
}

export function saveSession(token, user) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
}

export function updateSessionUser(user) {
 const token = getToken();
 if (!token) return;
 saveSession(token, user);
}
 
export async function getProfile() {
  if (API_BASE) {
    const token = getToken();
    if (!token) throw new Error("Usuario no autenticado");

    const res = await fetch(`${API_BASE.replace(/\/$/, '')}/auth/me`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "No se pudo obtener el perfil");
    return data.data || data;
  }

  return getUser();
}

export function getToken() {
  return localStorage.getItem("token");
}

export function getUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

export function isAuthenticated() {
  return Boolean(getToken());
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}