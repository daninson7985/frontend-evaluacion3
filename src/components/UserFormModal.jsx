import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

const initialForm = { full_name: "", email: "", role: "user", password: "" };

function UserFormModal({ show, handleClose, handleSave, selectedUser }) {
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    if (selectedUser) {
      setFormData({ ...selectedUser, password: "" });
    } else {
      setFormData(initialForm);
    }
  }, [selectedUser, show]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleSave(formData);
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
          <Form.Group className="mb-3">
            <Form.Label>Rol</Form.Label>
            <Form.Select name="role" value={formData.role} onChange={handleChange}>
              <option value="user">Usuario</option>
              <option value="coach">Coach</option>
              <option value="admin">Administrador</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
          <Button variant="primary" type="submit">Guardar</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default UserFormModal;