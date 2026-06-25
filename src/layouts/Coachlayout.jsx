import { Link, Outlet, useNavigate } from "react-router-dom";
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { logout, getUser } from "../services/authService";

function CoachLayout() {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="coach-theme">
      <Navbar 
        expand="lg" 
        sticky="top"
        style={{
          background: 'linear-gradient(90deg, #0ea95b 0%, #4ade80 100%)',
          boxShadow: '0 8px 20px rgba(14, 169, 91, 0.4)'
        }}
      >
        <Container>
          <Navbar.Brand href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src="/sportclub-logo.png" alt="SportClub" style={{ height: '50px' }} onError={(e) => e.target.style.display = 'none'} />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" style={{ color: 'white' }} />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Link className="nav-link" to="/" style={{ color: 'white', fontWeight: '500' }}>Inicio</Link>
              <Link className="nav-link" to="/coach/dashboard" style={{ color: 'white', fontWeight: '500' }}>Panel</Link>
              <Link className="nav-link" to="/coach/classes" style={{ color: 'white', fontWeight: '500' }}>Mis Clases</Link>
              <Link className="nav-link" to="/coach/specialties" style={{ color: 'white', fontWeight: '500' }}>Especialidades</Link>
              <Link className="nav-link" to="/coach/students" style={{ color: 'white', fontWeight: '500' }}>Alumnos</Link>
              <Link className="nav-link" to="/coach/profile" style={{ color: 'white', fontWeight: '500' }}>Mi Perfil</Link>
              <Button variant="outline-light" onClick={handleLogout}>Cerrar Sesión</Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container style={{ marginTop: '30px', paddingBottom: '40px' }}>
        <Outlet />
      </Container>
    </div>
  );
}

export default CoachLayout;