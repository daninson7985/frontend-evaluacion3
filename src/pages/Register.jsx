import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Form, InputGroup, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import { registerUser, saveSession } from "../services/authService";

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
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validatePassword = (password) => {
    const hasUppercase = /[A-Z]/.test(password);
    if (!hasUppercase) {
      return "La contraseña debe contener al menos una letra mayúscula.";
    }
    const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
    if (!hasSpecialChar) {
      return "La contraseña debe contener al menos un carácter especial.";
    }
    const allCharsUnique = new Set(password).size === password.length;
    if (!allCharsUnique) {
      return "La contraseña no debe repetir caracteres.";
    }
    return null;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (!formData.full_name || !formData.email || !formData.password) {
        throw new Error("Todos los campos son obligatorios");
      }
      const passwordError = validatePassword(formData.password);
      if (passwordError) {
        throw new Error(passwordError);
      }
      const response = await registerUser(formData);
      const user = response?.data?.user;
      const token = response?.data?.token;
      if (user && token) {
        saveSession(token, user);
        if (user.role === "admin") navigate("/admin/dashboard");
        else if (user.role === "coach") navigate("/coach/dashboard");
        else navigate("/user/dashboard");
      } else {
        navigate("/login");
      }
    } catch (err) {
      const message = err.message || "Ocurrió un error al registrar";
      setError(message);
      Swal.fire({
        title: "Contraseña inválida",
        text: message,
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr', background: '#06040d' }}>
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <img src="/soccer-field.png" alt="SportClub" style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: '100vh' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(16, 6, 38, 0.88), rgba(107, 33, 168, 0.68))' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px', color: 'white' }}>
          <img src="/sportclub-logo.png" alt="SportClub" style={{ width: 'auto', maxWidth: '240px', height: 'auto', marginBottom: '24px' }} onError={(e) => e.target.style.display = 'none'} />
          <h1 style={{ fontSize: '44px', lineHeight: '1.05', margin: 0, maxWidth: '520px' }}>Crea tu cuenta y empieza tu transformación.</h1>
          <p style={{ marginTop: '24px', fontSize: '17px', maxWidth: '520px', color: 'rgba(255,255,255,0.88)' }}>
            Únete a SportClub para gestionar tus reservas, ver tus avances y entrenar con los mejores coaches.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', background: '#0a0611' }}>
        <div style={{ width: '100%', maxWidth: '460px', background: '#120924', borderRadius: '28px', padding: '40px', boxShadow: '0 24px 80px rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <div>
              <h2 style={{ fontSize: '30px', margin: 0, color: '#f2c94c' }}>Crear cuenta</h2>
              <p style={{ marginTop: '12px', color: '#c9c7d1', marginBottom: 0 }}>Registra tus datos y comienza a usar SportClub.</p>
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
              <Form.Label style={{ fontWeight: '600', marginBottom: '8px', color: '#e7e7f3' }}>Nombre completo</Form.Label>
              <Form.Control
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
                disabled={loading}
                style={{ borderRadius: '14px', padding: '14px', border: '1px solid rgba(255,255,255,0.12)', background: '#12091d', color: 'white', fontSize: '15px' }}
                placeholder="Juan Pérez"
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label style={{ fontWeight: '600', marginBottom: '8px', color: '#e7e7f3' }}>Correo electrónico</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
                style={{ borderRadius: '14px', padding: '14px', border: '1px solid rgba(255,255,255,0.12)', background: '#12091d', color: 'white', fontSize: '15px' }}
                placeholder="tu@email.com"
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label style={{ fontWeight: '600', marginBottom: '8px', color: '#e7e7f3' }}>Contraseña (mayúscula, carácter especial y sin repetidos)</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
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
                  Registrando...
                </>
              ) : 'Registrarse'}
            </Button>
          </Form>

          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <p style={{ marginBottom: '12px', color: '#a8a5b6' }}>¿Ya tienes cuenta?</p>
            <Link to="/login" style={{ backgroundColor: '#f2c94c', color: '#1a1a1a', padding: '12px 22px', borderRadius: '999px', textDecoration: 'none', fontWeight: '700', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #f2c94c' }}>
              Inicia sesión aquí
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;