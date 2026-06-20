import { Container, Row, Col, Button } from "react-bootstrap";

function CoachDashboard() {
  return (
    <Container>
      {/* Hero Section */}
      <div className="hero-section">
        <h1>Panel de Coach</h1>
        <p>Gestiona tus clases, alumnos y horarios de forma sencilla</p>
      </div>

      {/* Stats */}
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-number">5</div>
          <div className="stat-label">Clases esta Semana</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">34</div>
          <div className="stat-label">Alumnos Inscritos</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">92%</div>
          <div className="stat-label">Tasa de Asistencia</div>
        </div>
      </div>

      {/* Features */}
      <Row className="mb-4">
        <Col md={6} className="mb-4">
          <div className="feature-card">
            <div className="feature-card-header">
              <h3>Mis Clases</h3>
            </div>
            <div className="feature-card-body">
              <p>Administra el calendario de clases, horarios y contenido de cada sesión de entrenamiento.</p>
              <Button className="btn-theme">Gestionar Clases</Button>
            </div>
          </div>
        </Col>
        <Col md={6} className="mb-4">
          <div className="feature-card">
            <div className="feature-card-header">
              <h3>Alumnos</h3>
            </div>
            <div className="feature-card-body">
              <p>Visualiza la lista de alumnos inscritos, progreso y asistencia en tus clases.</p>
              <Button className="btn-theme">Ver Alumnos</Button>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default CoachDashboard;