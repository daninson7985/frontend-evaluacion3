import { useEffect, useMemo, useState } from "react";
import { Container, Row, Col, Table, Button, Spinner, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getErrorMessage } from "../../utils/errorMessage";
import { getUsers } from "../../services/userService";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await getUsers();
        setUsers(response.data || []);
      } catch (err) {
        setError(getErrorMessage(err, "No se pudieron cargar los usuarios"));
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  const userCounts = useMemo(() => {
    return {
      total: users.length,
      admin: users.filter((user) => user.role === "admin").length,
      coach: users.filter((user) => user.role === "coach").length,
      user: users.filter((user) => user.role === "user").length,
    };
  }, [users]);

  const refreshUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getUsers();
      setUsers(response.data || []);
    } catch (err) {
      setError(getErrorMessage(err, "No se pudieron cargar los usuarios"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      {/* Hero Section */}
      <div className="hero-section">
        <div>
          <h1>Panel de Administrador</h1>
          <p>Control total del sistema. Gestiona usuarios, coaches, clases y más</p>
        </div>
      </div>

      {/* Stats */}
      {error && <Alert variant="danger">{error}</Alert>}
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-number">{loading ? <Spinner animation="border" size="sm" /> : userCounts.total}</div>
          <div className="stat-label">Usuarios Totales</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{loading ? <Spinner animation="border" size="sm" /> : userCounts.user}</div>
          <div className="stat-label">Usuarios Estándar</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{loading ? <Spinner animation="border" size="sm" /> : userCounts.coach}</div>
          <div className="stat-label">Coaches Activos</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{loading ? <Spinner animation="border" size="sm" /> : userCounts.admin}</div>
          <div className="stat-label">Administradores</div>
        </div>
      </div>

      {/* Management Cards */}
      <Row className="mb-4">
        <Col md={4} className="mb-4">
          <div className="feature-card">
            <div className="feature-card-header">
              <h3>Gestión de Usuarios</h3>
            </div>
            <div className="feature-card-body">
              <p>Crear, editar y eliminar usuarios del sistema. Controla roles y permisos.</p>
              <Button as={Link} to="/admin/users" className="btn-theme">Administrar Usuarios</Button>
            </div>
          </div>
        </Col>
        <Col md={4} className="mb-4">
          <div className="feature-card">
            <div className="feature-card-header">
              <h3>Gestión de Coaches</h3>
            </div>
            <div className="feature-card-body">
              <p>Administra los coaches del club. Asigna clases y supervisa su desempeño.</p>
                <Button as={Link} to="/admin/coaches" className="btn-theme">Administrar Coaches</Button>
            </div>
          </div>
        </Col>
        <Col md={4} className="mb-4">
          <div className="feature-card">
            <div className="feature-card-header">
              <h3>Gestión de Clases</h3>
            </div>
            <div className="feature-card-body">
              <p>Crea, edita y supervisa todas las clases del club. Controla horarios.</p>
              <Button as={Link} to="/admin/classes" className="btn-theme">Administrar Clases</Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Recent Users Table */}
      <div className="feature-card">
        <div className="feature-card-header">
          <h3>Usuarios Recientes</h3>
        </div>
        <div className="feature-card-body">
          <Table responsive striped>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center py-4">
                    <Spinner animation="border" /> Cargando usuarios...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-4">
                    No hay usuarios disponibles.
                  </td>
                </tr>
              ) : (
                users.slice(0, 4).map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.full_name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      </div>
    </Container>
  );
}

export default AdminDashboard;