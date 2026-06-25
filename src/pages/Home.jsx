import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { getUser, isAuthenticated, logout } from "../services/authService";

function Home() {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setAuthenticated(isAuthenticated());
    setUser(getUser());
  }, []);

  const handleLogout = () => {
    logout();
    setAuthenticated(false);
    setUser(null);
    navigate("/login");
  };

  const dashboardPath = user?.role === "admin" ? "/admin/dashboard" : user?.role === "coach" ? "/coach/dashboard" : "/user/dashboard";

  return (
    <div className="home-page">
      <header className="home-header">
        <img src="/sportclub-logo.png" alt="SportClub" className="home-logo" onError={(e) => e.target.style.display = 'none'} />
        <nav className="home-nav">
          <Link to="/" className="home-link">Inicio</Link>
          {authenticated ? (
            <>
              <Button as={Link} to={dashboardPath} className="home-button" style={{ backgroundColor: '#4ade80', color: '#0f172a', fontWeight: '700', borderColor: '#4ade80' }}>
                Volver
              </Button>
              <Button variant="light" onClick={handleLogout} className="home-button secondary-button">
                Salir Sesión
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" className="home-button">Ingresar</Link>
              <Link to="/register" className="home-button">Registrarse</Link>
            </>
          )}
        </nav>
      </header>

      <section className="home-hero">
        <div className="home-hero-copy">
          <p className="home-tag">SportClub</p>
          <h1>Tu club deportivo digital para entrenar, reservar y crecer.</h1>
          <p className="home-description">
            Accede a tu perfil, crea tu cuenta, consulta clases y administra tus actividades según tu rol de usuario, coach o administrador.
          </p>
          <div className="home-actions">
            {authenticated ? (
              <>
                <Button as={Link} to={dashboardPath} className="home-action-button" style={{ backgroundColor: '#4ade80', color: '#0f172a', fontWeight: '700', borderColor: '#4ade80' }}>
                  Volver al panel
                </Button>
                <Button variant="light" onClick={handleLogout} className="home-action-button secondary-button">
                  Salir Sesión
                </Button>
              </>
            ) : (
              <>
                <Link to="/register" className="home-action-button link-button">Comenzar ahora</Link>
                <Link to="/login" className="home-action-button link-button">Ya tengo cuenta</Link>
              </>
            )}
          </div>
        </div>

        <div className="home-image-grid">
          <img src="/sports-hero.png" alt="SportClub" className="home-image" />
          <img src="/multi-sports.png" alt="Multideporte" className="home-image" />
          <img src="/basketball.png" alt="Básquetbol" className="home-image" />
          <img src="/soccer-field.png" alt="Fútbol" className="home-image" />
        </div>
      </section>

      <section style={{ padding: '0 40px 64px' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '36px', marginBottom: '24px' }}>Qué ofrece SportClub</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '24px', padding: '28px', boxShadow: '0 20px 60px rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <h3 style={{ marginBottom: '14px', color: '#d8b5ff' }}>Panel de usuario</h3>
              <p style={{ color: '#d1c4ff' }}>Reserva clases, ve tu progreso y accede al contenido que corresponde a tu perfil.</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '24px', padding: '28px', boxShadow: '0 20px 60px rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <h3 style={{ marginBottom: '14px', color: '#d8b5ff' }}>Panel de coach</h3>
              <p style={{ color: '#d1c4ff' }}>Gestiona alumnos y clases con un espacio pensado para entrenadores.</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '24px', padding: '28px', boxShadow: '0 20px 60px rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <h3 style={{ marginBottom: '14px', color: '#d8b5ff' }}>Panel de administrador</h3>
              <p style={{ color: '#d1c4ff' }}>Controla usuarios, roles y la operación del club desde un único lugar.</p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '0 40px 80px' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '36px', marginBottom: '24px' }}>Por qué registrarte</h2>
          <div style={{ display: 'grid', gap: '20px' }}>
            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '24px', padding: '28px', boxShadow: '0 16px 40px rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <h3 style={{ margin: '0 0 10px', color: '#d8b5ff' }}>Acceso rápido y organizado</h3>
              <p style={{ margin: 0, color: '#d1c4ff', lineHeight: '1.8' }}>Tu cuenta te permite acceder al contenido justo para tu rol: usuario, coach o administrador.</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '24px', padding: '28px', boxShadow: '0 16px 40px rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <h3 style={{ margin: '0 0 10px', color: '#d8b5ff' }}>Diseño claro y funcional</h3>
              <p style={{ margin: 0, color: '#d1c4ff', lineHeight: '1.8' }}>Navega con facilidad gracias a una estructura limpia y botones claros para cada acción.</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '24px', padding: '28px', boxShadow: '0 16px 40px rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <h3 style={{ margin: '0 0 10px', color: '#d8b5ff' }}>Listo para crecer</h3>
              <p style={{ margin: 0, color: '#d1c4ff', lineHeight: '1.8' }}>Empieza con una experiencia base funcional y amplia la aplicación con más módulos deportivos.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
