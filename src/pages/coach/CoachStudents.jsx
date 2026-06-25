import { Container } from "react-bootstrap";
import StudentsManager from "../../components/StudentsManager";

function CoachStudents() {
  return (
    <Container>
      <div className="hero-section">
        <h1>Alumnos Inscritos</h1>
        <p>Gestiona el progreso y asistencia de los alumnos en tus clases.</p>
      </div>
      <StudentsManager
        title="Lista de Alumnos"
        subtitle="Visualiza y administra a los alumnos inscritos en tus clases."
        emptyText="No hay alumnos inscritos aún. Agrega un alumno para comenzar."
      />
    </Container>
  );
}

export default CoachStudents;
