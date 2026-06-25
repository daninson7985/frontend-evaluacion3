import { useEffect, useState } from "react";
import { Container, Row, Col, Button, Spinner, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getErrorMessage } from "../../utils/errorMessage";
import { getProfile } from "../../services/authService";

function CoachDashboard() {
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

  const specialty = profile?.metadata?.specialty || "deportiva";
  const classesThisWeek = profile?.metadata?.classesThisWeek ?? 0;
  const studentsCount = profile?.metadata?.studentsCount ?? 0;
  const attendanceRate = profile?.metadata?.attendanceRate ?? "0%";

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
          <h1>Panel de Coach{profile?.full_name ? `, ${profile.full_name}` : ""}</h1>
          <p>Gestiona tus clases, alumnos y horarios de forma sencilla</p>
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Stats */}
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-number">{loading ? <Spinner animation="border" size="sm" /> : classesThisWeek}</div>
          <div className="stat-label">Clases esta Semana</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{loading ? <Spinner animation="border" size="sm" /> : studentsCount}</div>
          <div className="stat-label">Alumnos Inscritos</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{loading ? <Spinner animation="border" size="sm" /> : attendanceRate}</div>
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
              <Button as={Link} to="/coach/classes" className="btn-theme">Gestionar Clases</Button>
            </div>
          </div>
        </Col>
        <Col md={6} className="mb-4">
          <div className="feature-card">
            <div className="feature-card-header">
              <h3>Especialidad: {specialty}</h3>
            </div>
            <div className="feature-card-body">
              <p>Visualiza la lista de alumnos inscritos, progreso y asistencia en tus clases.</p>
              <Button as={Link} to="/coach/specialties" className="btn-theme">Ver Especialidades</Button>
            </div>
          </div>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col md={12}>
          <div className="feature-card">
            <div className="feature-card-header">
              <h3>Alumnos Inscritos</h3>
            </div>
            <div className="feature-card-body">
              <p>Visualiza la lista de alumnos inscritos, progreso y asistencia en tus clases.</p>
              <Button as={Link} to="/coach/students" className="btn-theme">Gestionar Alumnos</Button>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default CoachDashboard;