import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

const initialStudent = {
  full_name: "",
  email: "",
  class_name: "",
  progress: "",
  attendance: "",
};

function StudentFormModal({ show, handleClose, handleSave, selectedStudent }) {
  const [formData, setFormData] = useState(initialStudent);

  useEffect(() => {
    if (selectedStudent) {
      setFormData({
        full_name: selectedStudent.full_name || "",
        email: selectedStudent.email || "",
        class_name: selectedStudent.class_name || "",
        progress: selectedStudent.progress || "",
        attendance: selectedStudent.attendance || "",
      });
    } else {
      setFormData(initialStudent);
    }
  }, [selectedStudent, show]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const payload = { ...formData };
    if (!payload.progress) delete payload.progress;
    if (!payload.attendance) delete payload.attendance;
    handleSave(payload);
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{selectedStudent ? "Editar Alumno" : "Nuevo Alumno"}</Modal.Title>
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
            <Form.Label>Clase</Form.Label>
            <Form.Control
              type="text"
              name="class_name"
              value={formData.class_name}
              onChange={handleChange}
              placeholder="Ej. Functional Training"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Progreso</Form.Label>
            <Form.Control
              type="text"
              name="progress"
              value={formData.progress}
              onChange={handleChange}
              placeholder="Ej. 75%"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Asistencia</Form.Label>
            <Form.Control
              type="text"
              name="attendance"
              value={formData.attendance}
              onChange={handleChange}
              placeholder="Ej. 8/10"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" size="sm" onClick={handleClose}>Cancelar</Button>
          <Button className="btn-create-user btn-sm" type="submit">
            {selectedStudent ? "Guardar cambios" : "Agregar alumno"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default StudentFormModal;
