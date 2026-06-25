import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

const initialClass = {
  name: "",
  schedule: "",
  coach: "",
  capacity: "",
};

function ClassFormModal({ show, handleClose, handleSave, selectedClass }) {
  const [formData, setFormData] = useState(initialClass);

  useEffect(() => {
    if (selectedClass) {
      setFormData({
        name: selectedClass.name || "",
        schedule: selectedClass.schedule || "",
        coach: selectedClass.coach || "",
        capacity: selectedClass.capacity ?? "",
      });
    } else {
      setFormData(initialClass);
    }
  }, [selectedClass, show]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const payload = { ...formData };
    if (!payload.capacity) delete payload.capacity;
    handleSave(payload);
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{selectedClass ? "Editar Clase" : "Nueva Clase"}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={onSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Nombre de la clase</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Horario</Form.Label>
            <Form.Control
              type="text"
              name="schedule"
              value={formData.schedule}
              onChange={handleChange}
              placeholder="Ej. Lunes 18:00"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Coach</Form.Label>
            <Form.Control
              type="text"
              name="coach"
              value={formData.coach}
              onChange={handleChange}
              placeholder="Nombre del coach"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Cupo</Form.Label>
            <Form.Control
              type="number"
              min="1"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              placeholder="Cantidad de alumnos"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" size="sm" onClick={handleClose}>Cancelar</Button>
          <Button className="btn-create-user btn-sm" type="submit">
            {selectedClass ? "Guardar cambios" : "Crear clase"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default ClassFormModal;
