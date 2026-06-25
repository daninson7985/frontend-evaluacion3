import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import Swal from "sweetalert2";

const initialForm = { full_name: "", email: "", role: "user", password: "", birth_date: "" };

function UserFormModal({ show, handleClose, handleSave, selectedUser, fixedRole = null, hideRoleSelect = false }) {
  const [formData, setFormData] = useState(initialForm);
  const [error, setError] = useState("");

  useEffect(() => {
    if (selectedUser) {
      setFormData({
        full_name: selectedUser.full_name || "",
        email: selectedUser.email || "",
        role: selectedUser.role || "user",
        birth_date: selectedUser.birth_date || "",
        password: "",
      });
    } else {
      setFormData({ ...initialForm, role: fixedRole || "user" });
    }
    setError("");
  }, [selectedUser, show, fixedRole]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const validatePassword = (password) => {
    if (!password) return null;
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

  const onSubmit = (e) => {
    e.preventDefault();
    const payload = { ...formData };
    if (fixedRole) payload.role = fixedRole;
    if (!payload.password) {
      delete payload.password;
    }
    if (!payload.birth_date) {
      delete payload.birth_date;
    }

    if (!selectedUser && !payload.password) {
      const message = "La contraseña es obligatoria para crear un usuario.";
      setError(message);
      Swal.fire({
        title: "Contraseña inválida",
        text: message,
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      return;
    }

    if (payload.password) {
      const passwordError = validatePassword(payload.password);
      if (passwordError) {
        setError(passwordError);
        Swal.fire({
          title: "Contraseña inválida",
          text: passwordError,
          icon: "error",
          confirmButtonText: "Aceptar",
        });
        return;
      }
    }

    setError("");
    handleSave(payload);
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{selectedUser ? "Editar Usuario" : "Nuevo Usuario"}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={onSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Nombre Completo</Form.Label>
            <Form.Control type="text" name="full_name" value={formData.full_name} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Correo</Form.Label>
            <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
          </Form.Group>
          {!hideRoleSelect ? (
            <Form.Group className="mb-3">
              <Form.Label>Rol</Form.Label>
              <Form.Select name="role" value={formData.role} onChange={handleChange}>
                <option value="user">Usuario</option>
                <option value="coach">Coach</option>
                <option value="admin">Administrador</option>
              </Form.Select>
            </Form.Group>
          ) : (
            <Form.Control type="hidden" name="role" value={formData.role} />
          )}
          <Form.Group className="mb-3">
            <Form.Label>Fecha de Nacimiento</Form.Label>
            <Form.Control
              type="date"
              name="birth_date"
              value={formData.birth_date}
              onChange={handleChange}
              required={!selectedUser}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Contraseña {selectedUser ? "(opcional)" : ""}</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={selectedUser ? "Dejar en blanco para mantener la contraseña" : "Ingrese una contraseña"}
              required={!selectedUser}
            />
            {!selectedUser && (
              <Form.Text className="text-muted">
                Debe incluir al menos una letra mayúscula, un carácter especial y no repetir caracteres.
              </Form.Text>
            )}
            {error && <Form.Text className="text-danger">{error}</Form.Text>}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" size="sm" onClick={handleClose}>Cancelar</Button>
          <Button className="btn-create-user btn-sm" type="submit">
            {selectedUser ? "Guardar cambios" : "Crear usuario"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default UserFormModal;