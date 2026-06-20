import { useEffect, useState } from "react";
import { Button, Card, Table } from "react-bootstrap";
import Swal from "sweetalert2";
import UserFormModal from "../../components/UserFormModal";
import { createUser, deleteUser, getUsers, updateUser } from "../../services/userService";

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [opLoading, setOpLoading] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      setUsers(data.data);
    } catch (err) {
      Swal.fire("Error", err.message || "No se pudieron cargar los usuarios", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const handleSave = async (formData) => {
    setOpLoading(true);
    try {
      if (selectedUser) {
        await updateUser(selectedUser.id, formData);
        Swal.fire("Éxito", "Usuario actualizado correctamente", "success");
      } else {
        await createUser(formData);
        Swal.fire("Éxito", "Usuario creado correctamente", "success");
      }
      setShowModal(false);
      await loadUsers();
    } catch (error) {
      Swal.fire("Error", error.message || "Ocurrió un error al guardar", "error");
    } finally {
      setOpLoading(false);
    }
  };

  const handleDelete = async (user) => {
    const result = await Swal.fire({
      title: "¿Eliminar usuario?",
      text: `Se eliminará a ${user.full_name}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
    });

    if (result.isConfirmed) {
      setOpLoading(true);
      try {
        await deleteUser(user.id);
        Swal.fire("Eliminado", "El usuario ha sido eliminado", "success");
        await loadUsers();
      } catch (err) {
        Swal.fire("Error", err.message || "Error al eliminar", "error");
      } finally {
        setOpLoading(false);
      }
    }
  };

  return (
    <Card className="shadow-sm">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h4 className="mb-0">Gestión de Usuarios</h4>
        <Button variant="danger" onClick={() => { setSelectedUser(null); setShowModal(true); }}>
          Nuevo Usuario
        </Button>
      </Card.Header>
      <Card.Body>
        <Table responsive striped bordered hover>
          <thead>
            <tr>
              <th>ID</th><th>Nombre</th><th>Correo</th><th>Rol</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.full_name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <Button variant="warning" size="sm" className="me-2" onClick={() => { setSelectedUser(user); setShowModal(true); }}>Editar</Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(user)}>Eliminar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
      <UserFormModal show={showModal} handleClose={() => setShowModal(false)} handleSave={handleSave} selectedUser={selectedUser} />
    </Card>
  );
}

export default UsersPage;