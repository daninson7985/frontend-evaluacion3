import { Container } from "react-bootstrap";
import SportsManager from "../../components/SportsManager";

function AdminSports() {
  return (
    <Container>
      <div className="hero-section">
        <h1>Gestión de Deportes</h1>
        <p>Crea, edita y elimina deportes sin tocar el backend.</p>
      </div>
      <SportsManager
        title="Gestión de Deportes"
        subtitle="Administra los deportes disponibles en el sistema."
        emptyText="No hay deportes creados aún. Usa el botón para agregar uno."
      />
    </Container>
  );
}

export default AdminSports;
