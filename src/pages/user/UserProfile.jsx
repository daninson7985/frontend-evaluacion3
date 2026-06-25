import { useEffect, useState } from "react";
import { Container, Card, Button, Spinner, Alert, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { getProfile, updateSessionUser } from "../../services/authService";
import { updateUser } from "../../services/userService";
import ProfileFormModal from "../../components/ProfileFormModal";

function UserProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setError("");
        setLoading(true);
        const data = await getProfile();
        setProfile(data);
      } catch (err) {
        setError(err.message || "No se pudo cargar el perfil");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleSave = async (formData) => {
    if (!profile) return;
    setSaving(true);
    try {
      const response = await updateUser(profile.id, formData);
      const updatedProfile = {
        ...profile,
        ...response.data,
        metadata: {
          ...profile.metadata,
          ...(response.data?.metadata || {}),
          ...(formData.metadata || {}),
        },
      };
      setProfile(updatedProfile);
      updateSessionUser(updatedProfile);
      Swal.fire({
        title: "Éxito",
        text: "Perfil actualizado correctamente.",
        icon: "success",
        confirmButtonText: "Aceptar",
      });
      setShowModal(false);
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: err.message || "No se pudo actualizar el perfil.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container>
      <div className="hero-section">
        <h1>Mi Perfil</h1>
        <p>Revisa tus datos personales, actividades y estado de la cuenta.</p>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
        </div>
      ) : (
        <Row className="g-4">
          <Col md={6}>
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title>{profile?.full_name}</Card.Title>
                <Card.Text>
                  <strong>Correo:</strong> {profile?.email}
                  <br />
                  <strong>Rol:</strong> {profile?.role}
                  <br />
                  <strong>Fecha de nacimiento:</strong> {profile?.birth_date || "No disponible"}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title>Detalles de la cuenta</Card.Title>
                <Card.Text>
                  <strong>Actividades:</strong> {profile?.metadata?.sports?.length ?? 0}
                  <br />
                  <strong>Deportes activos:</strong> {profile?.metadata?.sports?.map((item) => item.name).join(", ") || "No registrado"}
                </Card.Text>
                <Button variant="success" size="sm" className="me-2" onClick={() => setShowModal(true)}>
                  Actualizar datos
                </Button>
                <Button as={Link} to="/user/dashboard" className="btn-theme">
                  Volver al panel
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
     <ProfileFormModal
       show={showModal}
       handleClose={() => setShowModal(false)}
       handleSave={handleSave}
       profile={profile}
       role="user"
     />
    </Container>
  );
}

export default UserProfile;
