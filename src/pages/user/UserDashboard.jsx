import { Container, Row, Col, Card, Button } from "react-bootstrap";

function UserDashboard() {
  return (
    <Container>
      {/* Hero Section */}
      <div className="hero-section">
        <h1>Bienvenido a tu Dashboard</h1>
        <p>Accede a tus reservas, clases disponibles y gestiona tu perfil deportivo</p>
      </div>

      {/* Stats */}
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-number">3</div>
          <div className="stat-label">Reservas Activas</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">12</div>
          <div className="stat-label">Clases Disponibles</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">8</div>
          <div className="stat-label">Mis Favoritas</div>
        </div>
      </div>

      {/* Features */}
      <Row className="mb-4">
        <Col md={6} className="mb-4">
          <div className="feature-card">
            <div className="feature-card-header">
              <h3>Mis Reservas</h3>
            </div>
            <div className="feature-card-body">
              <p>Gestiona todas tus reservas de clases. Visualiza horarios, instructores y ubicaciones.</p>
              <Button className="btn-theme">Ver Reservas</Button>
            </div>
          </div>
        </Col>
        <Col md={6} className="mb-4">
          <div className="feature-card">
            <div className="feature-card-header">
              <h3>Clases Disponibles</h3>
            </div>
            <div className="feature-card-body">
              <p>Descubre nuevas clases y deportes. Reserva tu lugar y sé parte de nuestra comunidad.</p>
              <Button className="btn-theme">Explorar Clases</Button>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default UserDashboard;