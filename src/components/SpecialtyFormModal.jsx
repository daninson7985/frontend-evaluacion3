import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

const initialSpecialty = {
  name: "",
  description: "",
  level: "Intermedio",
};

function SpecialtyFormModal({ show, handleClose, handleSave, selectedSpecialty }) {
  const [formData, setFormData] = useState(initialSpecialty);

  useEffect(() => {
    if (selectedSpecialty) {
      setFormData({
        name: selectedSpecialty.name || "",
        description: selectedSpecialty.description || "",
        level: selectedSpecialty.level || "Intermedio",
      });
    } else {
      setFormData(initialSpecialty);
    }
  }, [selectedSpecialty, show]);

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
        <Modal.Title>{selectedSpecialty ? "Editar Especialidad" : "Nueva Especialidad"}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={onSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Nombre de la especialidad</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ej. Functional Training"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe la especialidad"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Nivel</Form.Label>
            <Form.Select
              name="level"
              value={formData.level}
              onChange={handleChange}
            >
              <option value="Principiante">Principiante</option>
              <option value="Intermedio">Intermedio</option>
              <option value="Avanzado">Avanzado</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" size="sm" onClick={handleClose}>Cancelar</Button>
          <Button className="btn-create-user btn-sm" type="submit">
            {selectedSpecialty ? "Guardar cambios" : "Crear especialidad"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default SpecialtyFormModal;
