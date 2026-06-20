import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import AdminLayout from "../layouts/AdminLayout";
import UsersPage from "../pages/admin/UsersPage";
import RoleRoute from "./RoleRoute";
import UserLayout from "../layouts/UserLayout";
import CoachLayout from "../layouts/CoachLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import UserDashboard from "../pages/user/UserDashboard";
import CoachDashboard from "../pages/coach/CoachDashboard";

const Unauthorized = () => <h2>Acceso no autorizado</h2>;

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Rutas de Administrador */}
        <Route path="/admin" element={<RoleRoute allowedRoles={["admin"]}><AdminLayout /></RoleRoute>}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UsersPage />} />
        </Route>

        {/* Rutas de Usuario */}
        <Route path="/user" element={<RoleRoute allowedRoles={["user"]}><UserLayout /></RoleRoute>}>
          <Route path="dashboard" element={<UserDashboard />} />
        </Route>

        {/* Rutas de Coach */}
        <Route path="/coach" element={<RoleRoute allowedRoles={["coach"]}><CoachLayout /></RoleRoute>}>
          <Route path="dashboard" element={<CoachDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;