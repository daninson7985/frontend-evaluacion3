import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import ClassesManager from "../../components/ClassesManager";

function AdminClasses() {
  return (
    <Container>
      <div className="hero-section">
        <h1>Gestión de Clases</h1>
        <p>Crea, edita y elimina clases para coach y administración.</p>
      </div>
      <ClassesManager
        title="Gestión de Clases"
        subtitle="Administra todas las clases disponibles en el sistema."
        emptyText="No hay clases creadas aún. Usa el botón para agregar una clase."
      />
    </Container>
  );
}

export default AdminClasses;
