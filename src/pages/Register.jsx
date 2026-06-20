import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Form, Spinner } from "react-bootstrap";
import { registerUser } from "../services/authService";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "user"
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (!formData.full_name || !formData.email || !formData.password) {
        throw new Error("Todos los campos son obligatorios");
      }
      await registerUser(formData);
      navigate("/login");
    } catch (err) {
      setError(err.message || "Ocurrió un error al registrar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0ea95b 0%, #4ade80 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '40px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        width: '100%',
        maxWidth: '400px'
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <img 
            src="/sportclub-logo.png" 
            alt="SportClub" 
            style={{ height: '60px', marginBottom: '20px' }}
            onError={(e) => e.target.style.display = 'none'}
          />
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1a1a1a', margin: 0 }}>
            Crear Cuenta
          </h1>
          <p style={{ color: '#666', fontSize: '14px', marginTop: '8px' }}>
            Únete a la comunidad SportClub
          </p>
        </div>

        {error && (
          <Alert variant="danger" style={{ marginBottom: '20px', borderRadius: '8px' }}>
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-4">
            <Form.Label style={{ fontWeight: '600', marginBottom: '8px', color: '#333' }}>
              Nombre Completo
            </Form.Label>
            <Form.Control 
              type="text" 
              name="full_name"
              value={formData.full_name} 
              onChange={handleChange} 
              required 
              disabled={loading}
              style={{
                borderRadius: '8px',
                padding: '12px',
                border: '1px solid #ddd',
                fontSize: '14px'
              }}
              placeholder="Juan Pérez"
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label style={{ fontWeight: '600', marginBottom: '8px', color: '#333' }}>
              Correo electrónico
            </Form.Label>
            <Form.Control 
              type="email" 
              name="email"
              value={formData.email} 
              onChange={handleChange} 
              required 
              disabled={loading}
              style={{
                borderRadius: '8px',
                padding: '12px',
                border: '1px solid #ddd',
                fontSize: '14px'
              }}
              placeholder="tu@email.com"
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label style={{ fontWeight: '600', marginBottom: '8px', color: '#333' }}>
              Contraseña
            </Form.Label>
            <Form.Control 
              type="password" 
              name="password"
              value={formData.password} 
              onChange={handleChange} 
              required 
              disabled={loading}
              style={{
                borderRadius: '8px',
                padding: '12px',
                border: '1px solid #ddd',
                fontSize: '14px'
              }}
              placeholder="••••••••"
            />
          </Form.Group>

          <Button 
            type="submit" 
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #0ea95b 0%, #4ade80 100%)',
              border: 'none',
              padding: '12px',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '15px'
            }}
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" style={{ marginRight: '8px' }} /> 
                Registrando...
              </>
            ) : 'Registrarse'}
          </Button>
        </Form>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <p style={{ color: '#666', fontSize: '14px', margin: '0 0 12px 0' }}>
            ¿Ya tienes cuenta?
          </p>
          <Link 
            to="/login" 
            style={{
              color: '#0ea95b',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '14px'
            }}
          >
            Inicia sesión aquí
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;