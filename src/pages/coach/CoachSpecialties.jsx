import { Container } from "react-bootstrap";
import SpecialtiesManager from "../../components/SpecialtiesManager";

function CoachSpecialties() {
  return (
    <Container>
      <div className="hero-section">
        <h1>Gestión de Especialidades</h1>
        <p>Gestiona las especialidades de entrenamiento disponibles.</p>
      </div>
      <SpecialtiesManager
        title="Especialidades de Entrenamiento"
        subtitle="Crea y gestiona las especialidades que ofrecerás a tus alumnos."
        emptyText="No hay especialidades. Crea una para comenzar."
      />
    </Container>
  );
}

export default CoachSpecialties;
