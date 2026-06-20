// authService with fallback to mocks. If VITE_API_URL is set, requests go to the backend.
const API_BASE = import.meta.env.VITE_API_URL || null;

// Simple in-memory mock users used when no backend is configured
let mockUsers = [
  { id: 1, full_name: "Admin Prueba", email: "admin@sportclub.cl", password: "123456", role: "admin" },
  { id: 2, full_name: "Juan Pérez", email: "juan@mail.com", password: "juan123", role: "user" }
];

export async function loginUser(credentials) {
  if (API_BASE) {
    // Call real backend
    const res = await fetch(`${API_BASE.replace(/\/$/, '')}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "Login failed");
    return { ok: true, data };
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
    if (!res.ok) throw new Error(data?.message || "Register failed");
    return { ok: true, data };
  }

  // Mock register
  const exists = mockUsers.some(u => u.email === payload.email);
  if (exists) throw new Error("El correo ya está registrado");
  const newUser = { id: Date.now(), ...payload };
  mockUsers.push(newUser);
  return { ok: true, data: { user: { id: newUser.id, full_name: newUser.full_name, email: newUser.email, role: newUser.role }, token: `fake-jwt-token-${newUser.role}` } };
}

export function saveSession(token, user) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
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