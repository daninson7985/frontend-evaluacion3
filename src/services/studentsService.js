import { getUsers } from "./userService";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const STUDENTS_STORAGE_KEY = "sportclub_students";

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

function loadLocalStudents() {
  try {
    const stored = localStorage.getItem(STUDENTS_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // ignore
  }
  return [
    { id: 1, full_name: "Ana Flores", email: "ana.flores@demo.cl", class_name: "Functional Training", progress: "72%", attendance: "8/10" },
    { id: 2, full_name: "Carlos Méndez", email: "carlos.mendez@demo.cl", class_name: "Entrenamiento de fuerza", progress: "91%", attendance: "10/10" },
    { id: 3, full_name: "María López", email: "maria.lopez@demo.cl", class_name: "HIIT", progress: "65%", attendance: "6/10" },
  ];
}

function persistLocalStudents(students) {
  localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(students));
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

export async function getStudents() {
  if (API_BASE) {
    try {
      const res = await fetch(`${normalizeApiBase()}/students`, { headers: getHeaders(false) });
      const data = await handleResponse(res, "Error obteniendo alumnos");
      return { data: data.data || data };
    } catch {
      try {
        const users = await getUsers();
        const students = (users.data || []).filter((user) => user.role === "user");
        if (students.length > 0) {
          return {
            data: students.map((student) => ({
              id: student.id,
              full_name: student.full_name,
              email: student.email,
              class_name: student.metadata?.sports?.[0]?.name || "Sin clase asignada",
              progress: student.metadata?.progress || "—",
              attendance: student.metadata?.attendance || "—"
            }))
          };
        }
      } catch {
        // ignore and fallback to local students
      }
      return { data: loadLocalStudents() };
    }
  }
  return { data: loadLocalStudents() };
}

export async function createStudent(studentData) {
  if (API_BASE) {
    try {
      const res = await fetch(`${normalizeApiBase()}/students`, {
        method: "POST",
        headers: getHeaders(true),
        body: JSON.stringify(studentData),
      });
      const data = await handleResponse(res, "Error creando alumno");
      return { data: data.data || data };
    } catch {
      const students = loadLocalStudents();
      const newStudent = { id: Date.now(), ...studentData };
      const updated = [...students, newStudent];
      persistLocalStudents(updated);
      return { data: newStudent };
    }
  }

  const students = loadLocalStudents();
  const newStudent = { id: Date.now(), ...studentData };
  const updated = [...students, newStudent];
  persistLocalStudents(updated);
  return { data: newStudent };
}

export async function updateStudent(id, studentData) {
  if (API_BASE) {
    try {
      const res = await fetch(`${normalizeApiBase()}/students/${id}`, {
        method: "PUT",
        headers: getHeaders(true),
        body: JSON.stringify(studentData),
      });
      const data = await handleResponse(res, "Error actualizando alumno");
      return { data: data.data || data };
    } catch {
      const students = loadLocalStudents().map((item) => (item.id === id ? { ...item, ...studentData } : item));
      persistLocalStudents(students);
      return { data: studentData };
    }
  }

  const students = loadLocalStudents().map((item) => (item.id === id ? { ...item, ...studentData } : item));
  persistLocalStudents(students);
  return { data: studentData };
}

export async function deleteStudent(id) {
  if (API_BASE) {
    try {
      const res = await fetch(`${normalizeApiBase()}/students/${id}`, {
        method: "DELETE",
        headers: getHeaders(false),
      });
      if (res.ok) return true;
      await handleResponse(res, "Error eliminando alumno");
    } catch {
      const students = loadLocalStudents().filter((item) => item.id !== id);
      persistLocalStudents(students);
      return true;
    }
  }

  const students = loadLocalStudents().filter((item) => item.id !== id);
  persistLocalStudents(students);
  return true;
}
