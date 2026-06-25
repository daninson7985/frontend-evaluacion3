import { Container } from "react-bootstrap";
import ClassesManager from "../../components/ClassesManager";

function UserClasses() {
  return (
    <Container>
      <div className="hero-section">
        <h1>Clases Disponibles</h1>
        <p>Revisa y administra las clases disponibles para tu inscripción.</p>
      </div>
      <ClassesManager
        title="Clases Disponibles"
        subtitle="Visualiza las clases disponibles para inscripción."
        emptyText="No hay clases disponibles por el momento."
        canEdit={false}
      />
    </Container>
  );
}

export default UserClasses;
