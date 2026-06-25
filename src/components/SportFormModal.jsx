import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

const initialSport = {
  name: "",
  objective: "",
  duration: "",
  status: true,
};

function SportFormModal({ show, handleClose, handleSave, selectedSport }) {
  const [formData, setFormData] = useState(initialSport);

  useEffect(() => {
    if (selectedSport) {
      setFormData({
        name: selectedSport.name || "",
        objective: selectedSport.objective || "",
        duration: selectedSport.duration || "",
        status: typeof selectedSport.status === 'boolean' ? selectedSport.status : true,
      });
    } else {
      setFormData(initialSport);
    }
  }, [selectedSport, show]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    // simple validations
    if (!formData.name?.trim()) return;
    if (formData.duration === "" || formData.duration === null || isNaN(Number(formData.duration))) return;
    if (!formData.objective?.trim()) return;
    const payload = { ...formData, duration: Number(formData.duration) };
    handleSave(payload);
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{selectedSport ? "Editar Deporte" : "Nuevo Deporte"}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={onSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Ej. Fútbol" required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Objetivo</Form.Label>
            <Form.Control as="textarea" rows={3} name="objective" value={formData.objective} onChange={handleChange} placeholder="Objetivo del deporte" required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Duración (minutos)</Form.Label>
            <Form.Control type="number" name="duration" value={formData.duration} onChange={handleChange} placeholder="Ej. 60" min={1} step={1} required />
          </Form.Group>
          <Form.Group className="mb-3 d-flex align-items-center">
            <Form.Check type="switch" id="status-switch" label="Activo" name="status" checked={!!formData.status} onChange={handleChange} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" size="sm" onClick={handleClose}>Cancelar</Button>
          <Button className="btn-create-user btn-sm" type="submit">
            {selectedSport ? "Guardar cambios" : "Crear deporte"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default SportFormModal;
