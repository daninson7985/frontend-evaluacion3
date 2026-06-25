import { useEffect, useState } from "react";
import { Button, Card, Table } from "react-bootstrap";
import Swal from "sweetalert2";
import { getErrorMessage } from "../../utils/errorMessage";
import UserFormModal from "../../components/UserFormModal";
import { createUser, deleteUser, getUsers, updateUser } from "../../services/userService";

function AdminCoaches() {
  const [coaches, setCoaches] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [loading, setLoading] = useState(false);
  const [opLoading, setOpLoading] = useState(false);

  const loadCoaches = async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      setCoaches((data.data || []).filter((user) => user.role === "coach"));
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: getErrorMessage(err, "No se pudieron cargar los coaches"),
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCoaches(); }, []);

  const handleSave = async (formData) => {
    setOpLoading(true);
    try {
      if (selectedCoach) {
        await updateUser(selectedCoach.id, formData);
        Swal.fire({
          title: "Éxito",
          text: "Coach actualizado correctamente",
          icon: "success",
          confirmButtonText: "Aceptar",
        });
      } else {
        await createUser(formData);
        Swal.fire({
          title: "Éxito",
          text: "Coach creado correctamente",
          icon: "success",
          confirmButtonText: "Aceptar",
        });
      }
      setShowModal(false);
      setSelectedCoach(null);
      await loadCoaches();
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: getErrorMessage(error, "Ocurrió un error al guardar el coach"),
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    } finally {
      setOpLoading(false);
    }
  };

  const handleDelete = async (coach) => {
    const result = await Swal.fire({
      title: "¿Eliminar coach?",
      text: `Se eliminará a ${coach.full_name}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
    });

    if (result.isConfirmed) {
      setOpLoading(true);
      try {
        await deleteUser(coach.id);
        Swal.fire({
          title: "Eliminado",
          text: "El coach ha sido eliminado",
          icon: "success",
          confirmButtonText: "Aceptar",
        });
        await loadCoaches();
      } catch (err) {
        Swal.fire({
          title: "Error",
          text: getErrorMessage(err, "No se pudo eliminar el coach"),
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      } finally {
        setOpLoading(false);
      }
    }
  };

  return (
    <Card className="shadow-sm">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <div>
          <h4 className="mb-0">Gestión de Coaches</h4>
          <small className="text-muted">Crea, edita y elimina perfiles de coach.</small>
        </div>
        <Button variant="success" onClick={() => { setSelectedCoach(null); setShowModal(true); }}>
          Nuevo Coach
        </Button>
      </Card.Header>
      <Card.Body>
        <Table responsive striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Fecha de nacimiento</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-4">Cargando coaches...</td>
              </tr>
            ) : coaches.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4">No hay coaches registrados aún.</td>
              </tr>
            ) : (
              coaches.map((coach) => (
                <tr key={coach.id}>
                  <td>{coach.id}</td>
                  <td>{coach.full_name}</td>
                  <td>{coach.email}</td>
                  <td>{coach.birth_date || "—"}</td>
                  <td>
                    <Button variant="warning" size="sm" className="me-2" onClick={() => { setSelectedCoach(coach); setShowModal(true); }}>
                      Editar
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(coach)}>
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Card.Body>
      <UserFormModal
        show={showModal}
        handleClose={() => { setShowModal(false); setSelectedCoach(null); }}
        handleSave={handleSave}
        selectedUser={selectedCoach}
        fixedRole="coach"
        hideRoleSelect={true}
      />
    </Card>
  );
}

export default AdminCoaches;
