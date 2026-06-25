import { useEffect, useState } from "react";
import { Button, Card, Table, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import { getErrorMessage } from "../utils/errorMessage";
import { createSpecialty, deleteSpecialty, getSpecialties, updateSpecialty } from "../services/specialtiesService";
import SpecialtyFormModal from "./SpecialtyFormModal";

function SpecialtiesManager({ title, subtitle, emptyText }) {
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [opLoading, setOpLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);

  const loadSpecialties = async () => {
    setLoading(true);
    try {
      const response = await getSpecialties();
      setSpecialties(response.data || []);
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: getErrorMessage(error, "No se pudieron cargar las especialidades"),
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSpecialties();
  }, []);

  const handleSave = async (formData) => {
    setOpLoading(true);
    try {
      if (selectedSpecialty) {
        await updateSpecialty(selectedSpecialty.id, formData);
        Swal.fire({
          title: "Éxito",
          text: "Especialidad actualizada correctamente",
          icon: "success",
          confirmButtonText: "Aceptar",
        });
      } else {
        await createSpecialty(formData);
        Swal.fire({
          title: "Éxito",
          text: "Especialidad creada correctamente",
          icon: "success",
          confirmButtonText: "Aceptar",
        });
      }
      setShowModal(false);
      setSelectedSpecialty(null);
      await loadSpecialties();
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: getErrorMessage(error, "Ocurrió un error al guardar la especialidad"),
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    } finally {
      setOpLoading(false);
    }
  };

  const handleDelete = async (specialtyItem) => {
    const result = await Swal.fire({
      title: "¿Eliminar especialidad?",
      text: `Se eliminará la especialidad ${specialtyItem.name}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
    });

    if (result.isConfirmed) {
      setOpLoading(true);
      try {
        await deleteSpecialty(specialtyItem.id);
        Swal.fire({
          title: "Eliminado",
          text: "La especialidad ha sido eliminada",
          icon: "success",
          confirmButtonText: "Aceptar",
        });
        await loadSpecialties();
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: getErrorMessage(error, "No se pudo eliminar la especialidad"),
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      } finally {
        setOpLoading(false);
      }
    }
  };

  return (
    <>
      <Card className="shadow-sm">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <div>
            <h4 className="mb-0">{title}</h4>
            <small className="text-muted">{subtitle}</small>
          </div>
          <div>
            <Button variant="success" size="sm" onClick={() => { setSelectedSpecialty(null); setShowModal(true); }}>
              Nueva Especialidad
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Nivel</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    <Spinner animation="border" /> Cargando especialidades...
                  </td>
                </tr>
              ) : specialties.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    {emptyText}
                  </td>
                </tr>
              ) : (
                specialties.map((specialtyItem) => (
                  <tr key={specialtyItem.id}>
                    <td>{specialtyItem.id}</td>
                    <td>{specialtyItem.name}</td>
                    <td>{specialtyItem.description || "—"}</td>
                    <td>{specialtyItem.level || "—"}</td>
                    <td>
                      <Button
                        variant="warning"
                        size="sm"
                        className="me-2"
                        onClick={() => { setSelectedSpecialty(specialtyItem); setShowModal(true); }}
                      >
                        Editar
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(specialtyItem)}>
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
      <SpecialtyFormModal
        show={showModal}
        handleClose={() => { setShowModal(false); setSelectedSpecialty(null); }}
        handleSave={handleSave}
        selectedSpecialty={selectedSpecialty}
      />
    </>
  );
}

export default SpecialtiesManager;
