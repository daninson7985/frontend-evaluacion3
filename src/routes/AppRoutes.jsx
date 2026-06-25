import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AdminLayout from "../layouts/AdminLayout";
import UsersPage from "../pages/admin/UsersPage";
import RoleRoute from "./RoleRoute";
import UserLayout from "../layouts/UserLayout";
import CoachLayout from "../layouts/CoachLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminClasses from "../pages/admin/AdminClasses";
import AdminProfile from "../pages/admin/AdminProfile";
import AdminSpecialties from "../pages/admin/AdminSpecialties";
import AdminCoaches from "../pages/admin/AdminCoaches";
import AdminSports from "../pages/admin/AdminSports";
import UserDashboard from "../pages/user/UserDashboard";
import UserProfile from "../pages/user/UserProfile";
import UserClasses from "../pages/user/UserClasses";
import CoachDashboard from "../pages/coach/CoachDashboard";
import CoachClasses from "../pages/coach/CoachClasses";
import CoachProfile from "../pages/coach/CoachProfile";
import CoachSpecialties from "../pages/coach/CoachSpecialties";
import CoachStudents from "../pages/coach/CoachStudents";

const Unauthorized = () => <h2>Acceso no autorizado</h2>;

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Rutas de Administrador */}
        <Route path="/admin" element={<RoleRoute allowedRoles={["admin"]}><AdminLayout /></RoleRoute>}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="classes" element={<AdminClasses />} />
          <Route path="coaches" element={<AdminCoaches />} />
          <Route path="specialties" element={<AdminSpecialties />} />
          <Route path="sports" element={<AdminSports />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>

        {/* Rutas de Usuario */}
        <Route path="/user" element={<RoleRoute allowedRoles={["user"]}><UserLayout /></RoleRoute>}>
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="classes" element={<UserClasses />} />
          <Route path="profile" element={<UserProfile />} />
        </Route>

        {/* Rutas de Coach */}
        <Route path="/coach" element={<RoleRoute allowedRoles={["coach"]}><CoachLayout /></RoleRoute>}>
          <Route path="dashboard" element={<CoachDashboard />} />
          <Route path="classes" element={<CoachClasses />} />
          <Route path="students" element={<CoachStudents />} />
          <Route path="specialties" element={<CoachSpecialties />} />
          <Route path="profile" element={<CoachProfile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;