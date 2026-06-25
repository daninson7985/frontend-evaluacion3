import { Container } from "react-bootstrap";
import ClassesManager from "../../components/ClassesManager";

function CoachClasses() {
  return (
    <Container>
      <div className="hero-section">
        <h1>Mis Clases</h1>
        <p>Gestiona y revisa las clases que lideras como coach.</p>
      </div>
      <ClassesManager
        title="Mis Clases"
        subtitle="Crea, edita y elimina tus clases asignadas como coach."
        emptyText="No tienes clases registradas aún. Agrega una clase nueva."
      />
    </Container>
  );
}

export default CoachClasses;
