import { Container, Row, Col, Table, Button } from "react-bootstrap";

function AdminDashboard() {
  return (
    <Container>
      {/* Hero Section */}
      <div className="hero-section">
        <h1>Panel de Administrador</h1>
        <p>Control total del sistema. Gestiona usuarios, coaches, clases y más</p>
      </div>

      {/* Stats */}
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-number">124</div>
          <div className="stat-label">Usuarios Totales</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">12</div>
          <div className="stat-label">Coaches Activos</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">45</div>
          <div className="stat-label">Clases Disponibles</div>
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
              <Button className="btn-theme">Administrar Usuarios</Button>
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
              <Button className="btn-theme">Administrar Coaches</Button>
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
              <Button className="btn-theme">Administrar Clases</Button>
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
              <tr>
                <td>1</td>
                <td>Juan Pérez</td>
                <td>juan@mail.com</td>
                <td>user</td>
              </tr>
              <tr>
                <td>2</td>
                <td>Ana Gómez</td>
                <td>ana@mail.com</td>
                <td>coach</td>
              </tr>
            </tbody>
          </Table>
        </div>
      </div>
    </Container>
  );
}

export default AdminDashboard;