import { Container } from "react-bootstrap";
import SpecialtiesManager from "../../components/SpecialtiesManager";

function AdminSpecialties() {
  return (
    <Container>
      <div className="hero-section">
        <h1>Gestión de Especialidades</h1>
        <p>Crea, edita y elimina especialidades de entrenamiento.</p>
      </div>
      <SpecialtiesManager
        title="Gestión de Especialidades"
        subtitle="Administra todas las especialidades disponibles en el sistema."
        emptyText="No hay especialidades creadas aún. Usa el botón para agregar una especialidad."
      />
    </Container>
  );
}

export default AdminSpecialties;
