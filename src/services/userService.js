// userService with optional backend integration via VITE_API_URL
const API_BASE = import.meta.env.VITE_API_URL || null;

function getHeaders() {
  const headers = { "Content-Type": "application/json" };
  const token = localStorage.getItem("token");
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

// Mock users for offline mode
let mockUsers = [
  { id: 1, full_name: "Juan Pérez", email: "juan@mail.com", role: "user" },
  { id: 2, full_name: "Ana Gómez", email: "ana@mail.com", role: "coach" }
];

export async function getUsers() {
  if (API_BASE) {
    const res = await fetch(`${API_BASE.replace(/\/$/, '')}/users`, { headers: getHeaders() });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "Error fetching users");
    return { data };
  }
  return { data: mockUsers };
}

export async function createUser(userData) {
  if (API_BASE) {
    const res = await fetch(`${API_BASE.replace(/\/$/, '')}/users`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "Error creating user");
    return { data };
  }

  const newUser = { id: Date.now(), ...userData };
  mockUsers.push(newUser);
  return { data: newUser };
}

export async function updateUser(id, userData) {
  if (API_BASE) {
    const res = await fetch(`${API_BASE.replace(/\/$/, '')}/users/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "Error updating user");
    return { data };
  }

  mockUsers = mockUsers.map(user => user.id === id ? { ...user, ...userData } : user);
  return { data: userData };
}

export async function deleteUser(id) {
  if (API_BASE) {
    const res = await fetch(`${API_BASE.replace(/\/$/, '')}/users/${id}`, { method: "DELETE", headers: getHeaders() });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data?.message || "Error deleting user");
    }
    return true;
  }

  mockUsers = mockUsers.filter(user => user.id !== id);
  return true;
}