import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Spinner, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getErrorMessage } from "../../utils/errorMessage";
import { getProfile } from "../../services/authService";

function UserDashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getProfile();
        setProfile(data);
      } catch (err) {
        setError(getErrorMessage(err, "No se pudo cargar el perfil"));
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const activityCount = profile?.metadata?.sports?.length ?? 0;
  const reservationsCount = profile?.reservationsCount ?? 0;
  const availableClasses = profile?.availableClasses ?? 0;

  const refreshProfile = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getProfile();
      setProfile(data);
    } catch (err) {
      setError(getErrorMessage(err, "No se pudo cargar el perfil"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      {/* Hero Section */}
      <div className="hero-section">
        <div>
          <h1>Bienvenido{profile?.full_name ? `, ${profile.full_name}` : ""}</h1>
          <p>Accede a tus reservas, clases disponibles y gestiona tu perfil deportivo</p>
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Stats */}
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-number">{loading ? <Spinner animation="border" size="sm" /> : reservationsCount}</div>
          <div className="stat-label">Reservas Activas</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{loading ? <Spinner animation="border" size="sm" /> : availableClasses}</div>
          <div className="stat-label">Clases Disponibles</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{loading ? <Spinner animation="border" size="sm" /> : activityCount}</div>
          <div className="stat-label">Actividades</div>
        </div>
      </div>

      {/* Features */}
      <Row className="mb-4">
        <Col md={6} className="mb-4">
          <div className="feature-card">
            <div className="feature-card-header">
              <h3>Mi Perfil</h3>
            </div>
            <div className="feature-card-body">
              <p>Actualiza tus datos personales y ajusta tu experiencia deportiva.</p>
              <Button as={Link} to="/user/profile" className="btn-theme">Ver Mi Perfil</Button>
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
              <Button as={Link} to="/user/classes" className="btn-theme">Explorar Clases</Button>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default UserDashboard;