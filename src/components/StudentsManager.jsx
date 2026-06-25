import { useEffect, useState } from "react";
import { Button, Card, Table, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import { createStudent, deleteStudent, getStudents, updateStudent } from "../services/studentsService";
import StudentFormModal from "./StudentFormModal";

function StudentsManager({ title, subtitle, emptyText }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [opLoading, setOpLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const response = await getStudents();
      setStudents(response.data || []);
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message || "No se pudieron cargar los alumnos",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleSave = async (formData) => {
    setOpLoading(true);
    try {
      if (selectedStudent) {
        await updateStudent(selectedStudent.id, formData);
        Swal.fire({
          title: "Éxito",
          text: "Alumno actualizado correctamente",
          icon: "success",
          confirmButtonText: "Aceptar",
        });
      } else {
        await createStudent(formData);
        Swal.fire({
          title: "Éxito",
          text: "Alumno agregado correctamente",
          icon: "success",
          confirmButtonText: "Aceptar",
        });
      }
      setShowModal(false);
      setSelectedStudent(null);
      await loadStudents();
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message || "Ocurrió un error al guardar el alumno",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    } finally {
      setOpLoading(false);
    }
  };

  const handleDelete = async (student) => {
    const result = await Swal.fire({
      title: "¿Eliminar alumno?",
      text: `Se eliminará a ${student.full_name}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
    });

    if (result.isConfirmed) {
      setOpLoading(true);
      try {
        await deleteStudent(student.id);
        Swal.fire({
          title: "Eliminado",
          text: "El alumno ha sido eliminado",
          icon: "success",
          confirmButtonText: "Aceptar",
        });
        await loadStudents();
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: error.message || "No se pudo eliminar el alumno",
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
          <Button variant="success" size="sm" onClick={() => { setSelectedStudent(null); setShowModal(true); }}>
            Nuevo Alumno
          </Button>
        </Card.Header>
        <Card.Body>
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Clase</th>
                <th>Progreso</th>
                <th>Asistencia</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-4">
                    <Spinner animation="border" /> Cargando alumnos...
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-4">
                    {emptyText}
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.id}>
                    <td>{student.id}</td>
                    <td>{student.full_name}</td>
                    <td>{student.email}</td>
                    <td>{student.class_name}</td>
                    <td>{student.progress || "—"}</td>
                    <td>{student.attendance || "—"}</td>
                    <td>
                      <Button variant="warning" size="sm" className="me-2" onClick={() => { setSelectedStudent(student); setShowModal(true); }}>
                        Editar
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(student)}>
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
      <StudentFormModal
        show={showModal}
        handleClose={() => { setShowModal(false); setSelectedStudent(null); }}
        handleSave={handleSave}
        selectedStudent={selectedStudent}
      />
    </>
  );
}

export default StudentsManager;
