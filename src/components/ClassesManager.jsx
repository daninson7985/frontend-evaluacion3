import { useEffect, useState } from "react";
import { Button, Card, Table, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import { getErrorMessage } from "../utils/errorMessage";
import { createClass, deleteClass, getClasses, updateClass } from "../services/classesService";
import ClassFormModal from "./ClassFormModal";

function ClassesManager({ title, subtitle, emptyText, canEdit = true }) {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [opLoading, setOpLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

  const loadClasses = async () => {
    setLoading(true);
    try {
      const response = await getClasses();
      setClasses(response.data || []);
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: getErrorMessage(error, "No se pudieron cargar las clases"),
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClasses();
  }, []);

  const handleSave = async (formData) => {
    setOpLoading(true);
    try {
      if (selectedClass) {
        await updateClass(selectedClass.id, formData);
        Swal.fire({
          title: "Éxito",
          text: "Clase actualizada correctamente",
          icon: "success",
          confirmButtonText: "Aceptar",
        });
      } else {
        await createClass(formData);
        Swal.fire({
          title: "Éxito",
          text: "Clase creada correctamente",
          icon: "success",
          confirmButtonText: "Aceptar",
        });
      }
      setShowModal(false);
      setSelectedClass(null);
      await loadClasses();
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: getErrorMessage(error, "Ocurrió un error al guardar la clase"),
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    } finally {
      setOpLoading(false);
    }
  };

  const handleDelete = async (classItem) => {
    const result = await Swal.fire({
      title: "¿Eliminar clase?",
      text: `Se eliminará la clase ${classItem.name}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
    });

    if (result.isConfirmed) {
      setOpLoading(true);
      try {
        await deleteClass(classItem.id);
        Swal.fire({
          title: "Eliminado",
          text: "La clase ha sido eliminada",
          icon: "success",
          confirmButtonText: "Aceptar",
        });
        await loadClasses();
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: getErrorMessage(error, "No se pudo eliminar la clase"),
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
          {canEdit && (
            <div>
              <Button variant="success" size="sm" onClick={() => { setSelectedClass(null); setShowModal(true); }}>
                Nueva Clase
              </Button>
            </div>
          )}
        </Card.Header>
        <Card.Body>
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Horario</th>
                <th>Coach</th>
                <th>Cupo</th>
                {canEdit && <th>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={canEdit ? 6 : 5} className="text-center py-4">
                    <Spinner animation="border" /> Cargando clases...
                  </td>
                </tr>
              ) : classes.length === 0 ? (
                <tr>
                  <td colSpan={canEdit ? 6 : 5} className="text-center py-4">
                    {emptyText}
                  </td>
                </tr>
              ) : (
                classes.map((classItem) => (
                  <tr key={classItem.id}>
                    <td>{classItem.id}</td>
                    <td>{classItem.name}</td>
                    <td>{classItem.schedule}</td>
                    <td>{classItem.coach || "No asignado"}</td>
                    <td>{classItem.capacity ?? "—"}</td>
                    {canEdit && (
                      <td>
                        <Button
                          variant="warning"
                          size="sm"
                          className="me-2"
                          onClick={() => { setSelectedClass(classItem); setShowModal(true); }}
                        >
                          Editar
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => handleDelete(classItem)}>
                          Eliminar
                        </Button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </Table>
          {!canEdit && !loading && classes.length > 0 && (
            <div className="text-muted mt-3">Solo puedes ver las clases disponibles. Contacta a tu coach o administrador para solicitar cambios.</div>
          )}
        </Card.Body>
      </Card>
      {canEdit && (
        <ClassFormModal
          show={showModal}
          handleClose={() => { setShowModal(false); setSelectedClass(null); }}
          handleSave={handleSave}
          selectedClass={selectedClass}
        />
      )}
    </>
  );
}

export default ClassesManager;
