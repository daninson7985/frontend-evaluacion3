import { Link, Outlet, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { getUser, logout } from "../services/authService";

function UserLayout() {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="user-theme">
      <Navbar 
        expand="lg" 
        sticky="top"
        style={{
          background: 'linear-gradient(90deg, #0b61d6 0%, #3aa0ff 100%)',
          boxShadow: '0 8px 20px rgba(11, 97, 214, 0.4)'
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
              <Link className="nav-link" to="/user/dashboard" style={{ color: 'white', fontWeight: '500' }}>Panel</Link>
              <Link className="nav-link" to="/user/classes" style={{ color: 'white', fontWeight: '500' }}>Clases</Link>
              <Link className="nav-link" to="/user/profile" style={{ color: 'white', fontWeight: '500' }}>Mi Perfil</Link>
              <span style={{ color: 'white', marginRight: '15px', display: 'flex', alignItems: 'center' }}>{user?.full_name}</span>
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

export default UserLayout;
