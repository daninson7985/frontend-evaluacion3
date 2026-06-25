import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Form, InputGroup, Spinner } from "react-bootstrap";
import { getErrorMessage } from "../utils/errorMessage";
import { loginUser, saveSession } from "../services/authService";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await loginUser({ email, password });
      saveSession(response.data.token, response.data.user);

      const role = response.data.user.role;
      if (role === "admin") navigate("/admin/dashboard");
      else if (role === "coach") navigate("/coach/dashboard");
      else navigate("/user/dashboard");
    } catch (err) {
      setError(getErrorMessage(err, "Ocurrió un error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr', background: '#08010f' }}>
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <img src="/sports-hero.png" alt="SportClub" style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: '100vh' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(16, 6, 38, 0.88), rgba(72, 16, 103, 0.64))' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px', color: '#d8b5ff' }}>
        <img src="/sportclub-logo.png" alt="SportClub" style={{ width: 'auto', maxWidth: '240px', height: 'auto', marginBottom: '24px' }} onError={(e) => e.target.style.display = 'none'} />
          <h1 style={{ fontSize: '44px', lineHeight: '1.05', margin: 0, maxWidth: '500px', color: '#d8b5ff' }}>Entrena con foco, reserva tus clases y alcanza tus metas.</h1>
          <p style={{ marginTop: '24px', fontSize: '17px', maxWidth: '520px', color: '#d8b5ff' }}>
            Accede a tu espacio deportivo personal con SportClub y gestiona tus entrenamientos desde una experiencia oscura y moderna.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', background: '#0a0611' }}>
        <div style={{ width: '100%', maxWidth: '460px', background: '#110824', borderRadius: '28px', padding: '40px', boxShadow: '0 24px 80px rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
            <div>
              <h2 style={{ fontSize: '30px', margin: 0, color: '#f2c94c' }}>Iniciar sesión</h2>
              <p style={{ marginTop: '12px', color: '#d8b5ff', marginBottom: 0 }}>Ingresa con tu correo y contraseña para acceder a tu panel.</p>
            </div>
            <Link to="/" style={{ backgroundColor: '#f2c94c', color: '#1a1a1a', padding: '10px 18px', borderRadius: '999px', textDecoration: 'none', fontWeight: '700', border: '1px solid #f2c94c', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              Inicio
            </Link>
          </div>

          {error && (
            <Alert variant="danger" style={{ marginBottom: '24px', borderRadius: '14px' }}>
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4">
              <Form.Label style={{ fontWeight: '600', marginBottom: '8px', color: '#d8b5ff' }}>Correo electrónico</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                style={{ borderRadius: '14px', padding: '14px', border: '1px solid rgba(255,255,255,0.12)', background: '#12091d', color: 'white', fontSize: '15px' }}
                placeholder="tu@email.com"
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label style={{ fontWeight: '600', marginBottom: '8px', color: '#d8b5ff' }}>Contraseña</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  style={{ borderRadius: '14px', padding: '14px', border: '1px solid rgba(255,255,255,0.12)', background: '#12091d', color: 'white', fontSize: '15px' }}
                  placeholder="••••••••"
                />
                <Button
                  variant="secondary"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  style={{ borderRadius: '0 14px 14px 0', borderColor: '#f2c94c', color: '#1a1a1a', background: '#f2c94c' }}
                  type="button"
                >
                  {showPassword ? 'Ocultar' : 'Mostrar'}
                </Button>
              </InputGroup>
            </Form.Group>
            <Button
              type="submit"
              variant="light"
              style={{ width: '100%', backgroundColor: '#f2c94c', borderColor: '#f2c94c', color: '#1a1a1a', padding: '14px', borderRadius: '14px', fontWeight: '700', fontSize: '15px', boxShadow: '0 12px 24px rgba(242, 201, 76, 0.22)' }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" style={{ marginRight: '8px' }} />
                  Procesando...
                </>
              ) : 'Ingresar'}
            </Button>
          </Form>

          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <p style={{ marginBottom: '12px', color: '#d8b5ff' }}>¿No tienes cuenta?</p>
            <Link to="/register" style={{ backgroundColor: '#f2c94c', color: '#1a1a1a', padding: '12px 22px', borderRadius: '999px', textDecoration: 'none', fontWeight: '700', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #f2c94c' }}>
              Regístrate aquí
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;