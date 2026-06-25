import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

const initialForm = {
  full_name: "",
  email: "",
  birth_date: "",
  password: "",
  campus: "",
  position: "",
  specialty: "",
};

function ProfileFormModal({ show, handleClose, handleSave, profile, role }) {
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        email: profile.email || "",
        birth_date: profile.birth_date || "",
        password: "",
        campus: profile.metadata?.campus || "",
        position: profile.metadata?.position || "",
        specialty: profile.metadata?.specialty || "",
      });
    } else {
      setFormData(initialForm);
    }
  }, [profile, show]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const payload = {
      full_name: formData.full_name,
      email: formData.email,
      birth_date: formData.birth_date || undefined,
      password: formData.password || undefined,
      metadata: {},
    };

    if (role === "admin") {
      payload.metadata.campus = formData.campus || undefined;
      payload.metadata.position = formData.position || undefined;
    }
    if (role === "coach") {
      payload.metadata.specialty = formData.specialty || undefined;
    }

    if (!payload.birth_date) delete payload.birth_date;
    if (!payload.password) delete payload.password;
    if (Object.keys(payload.metadata).length === 0) delete payload.metadata;

    handleSave(payload);
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Actualizar perfil</Modal.Title>
      </Modal.Header>
      <Form onSubmit={onSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Nombre completo</Form.Label>
            <Form.Control
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Correo</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Fecha de nacimiento</Form.Label>
            <Form.Control
              type="date"
              name="birth_date"
              value={formData.birth_date}
              onChange={handleChange}
            />
          </Form.Group>
          {role === "admin" && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Campus</Form.Label>
                <Form.Control
                  type="text"
                  name="campus"
                  value={formData.campus}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Posición</Form.Label>
                <Form.Control
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                />
              </Form.Group>
            </>
          )}
          {role === "coach" && (
            <Form.Group className="mb-3">
              <Form.Label>Especialidad</Form.Label>
              <Form.Control
                type="text"
                name="specialty"
                value={formData.specialty}
                onChange={handleChange}
              />
            </Form.Group>
          )}
          <Form.Group className="mb-3">
            <Form.Label>Contraseña (opcional)</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Dejar en blanco si no cambia la contraseña"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" size="sm" onClick={handleClose}>Cancelar</Button>
          <Button className="btn-create-user btn-sm" type="submit">Guardar cambios</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default ProfileFormModal;
