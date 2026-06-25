import { useEffect, useState } from "react";
import { Button, Card, Table, Spinner, Row, Col, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import { getErrorMessage } from "../utils/errorMessage";
import { getSports, createSport, deleteSport, updateSport, changeSportStatus } from "../services/sportsService";
import SportFormModal from "./SportFormModal";

function formatDateSpanish(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d)) return "—";
  const months = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  const day = String(d.getDate()).padStart(2, '0');
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  return `${day} de ${month} de ${year}`;
}

function SportsManager({ title, subtitle, emptyText }) {
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [opLoading, setOpLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedSport, setSelectedSport] = useState(null);
  const [viewMode, setViewMode] = useState('table');

  const loadSports = async () => {
    setLoading(true);
    try {
      const response = await getSports();
      setSports(response.data || []);
    } catch (error) {
      Swal.fire({ title: 'Error', text: getErrorMessage(error, 'No se pudieron cargar los deportes'), icon: 'error', confirmButtonText: 'Aceptar' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadSports(); }, []);

  const handleSave = async (formData) => {
    setOpLoading(true);
    try {
      if (selectedSport) {
        await updateSport(selectedSport.id, formData);
        Swal.fire({ title: 'Éxito', text: 'Deporte actualizado correctamente', icon: 'success', confirmButtonText: 'Aceptar' });
      } else {
        await createSport(formData);
        Swal.fire({ title: 'Éxito', text: 'Deporte creado correctamente', icon: 'success', confirmButtonText: 'Aceptar' });
      }
      setShowModal(false);
      setSelectedSport(null);
      await loadSports();
    } catch (error) {
      Swal.fire({ title: 'Error', text: getErrorMessage(error, 'Ocurrió un error al guardar el deporte'), icon: 'error', confirmButtonText: 'Aceptar' });
    } finally {
      setOpLoading(false);
    }
  };

  const handleDelete = async (sportItem) => {
    const result = await Swal.fire({ title: '¿Está seguro de eliminar este deporte?', text: `${sportItem.name}`, icon: 'warning', showCancelButton: true, confirmButtonText: 'Sí, eliminar', cancelButtonText: 'Cancelar', confirmButtonColor: '#d33' });
    if (result.isConfirmed) {
      setOpLoading(true);
      try {
        await deleteSport(sportItem.id);
        Swal.fire({ title: 'Eliminado', text: 'El deporte ha sido eliminado', icon: 'success', confirmButtonText: 'Aceptar' });
        await loadSports();
      } catch (error) {
        Swal.fire({ title: 'Error', text: getErrorMessage(error, 'No se pudo eliminar el deporte'), icon: 'error', confirmButtonText: 'Aceptar' });
      } finally {
        setOpLoading(false);
      }
    }
  };

  const handleToggleStatus = async (sportItem) => {
    const newStatus = !sportItem.status;
    try {
      await changeSportStatus(sportItem.id, newStatus);
      setSports((prev) => prev.map((s) => (s.id === sportItem.id ? { ...s, status: newStatus } : s)));
    } catch (error) {
      Swal.fire({ title: 'Error', text: getErrorMessage(error, 'No se pudo actualizar el estado'), icon: 'error', confirmButtonText: 'Aceptar' });
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
          <div>
            <Button variant="secondary" size="sm" className="me-2" onClick={() => loadSports()} disabled={loading}>Refrescar</Button>
            <Button variant="outline-primary" size="sm" className="me-2" onClick={() => setViewMode(viewMode === 'table' ? 'cards' : 'table')}>{viewMode === 'table' ? 'Ver como cards' : 'Ver como tabla'}</Button>
            <Button variant="success" size="sm" onClick={() => { setSelectedSport(null); setShowModal(true); }}>Nuevo Deporte</Button>
          </div>
        </Card.Header>
        <Card.Body>
          {viewMode === 'table' ? (
            <Table responsive striped bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Objetivo</th>
                  <th>Duración</th>
                  <th>Estado</th>
                  <th>Creado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} className="text-center py-4"><Spinner animation="border" /> Cargando deportes...</td></tr>
                ) : sports.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-4">{emptyText}</td></tr>
                ) : (
                  sports.map((sport) => (
                    <tr key={sport.id}>
                      <td>{sport.id}</td>
                      <td>{sport.name}</td>
                      <td>{sport.objective || '—'}</td>
                      <td>{sport.duration || '—'}</td>
                      <td>
                        <Form.Check type="switch" id={`switch-${sport.id}`} checked={!!sport.status} onChange={() => handleToggleStatus(sport)} />
                      </td>
                      <td>{formatDateSpanish(sport.created_at)}</td>
                      <td>
                        <Button variant="warning" size="sm" className="me-2" onClick={() => { setSelectedSport(sport); setShowModal(true); }}>Editar</Button>
                        <Button variant="danger" size="sm" onClick={() => handleDelete(sport)}>Eliminar</Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          ) : (
            <Row>
              {loading ? (
                <Col className="text-center py-4"><Spinner animation="border" /> Cargando deportes...</Col>
              ) : sports.length === 0 ? (
                <Col className="text-center py-4">{emptyText}</Col>
              ) : (
                sports.map((sport) => (
                  <Col md={4} key={sport.id} className="mb-3">
                    <Card>
                      <Card.Body>
                        <Card.Title>{sport.name}</Card.Title>
                        <Card.Text>{sport.objective}</Card.Text>
                        <Card.Text><strong>Duración:</strong> {sport.duration}</Card.Text>
                        <Card.Text><strong>Creado:</strong> {formatDateSpanish(sport.created_at)}</Card.Text>
                        <div className="d-flex justify-content-between">
                          <Form.Check type="switch" id={`card-switch-${sport.id}`} label="Activo" checked={!!sport.status} onChange={() => handleToggleStatus(sport)} />
                          <div>
                            <Button variant="warning" size="sm" className="me-2" onClick={() => { setSelectedSport(sport); setShowModal(true); }}>Editar</Button>
                            <Button variant="danger" size="sm" onClick={() => handleDelete(sport)}>Eliminar</Button>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))
              )}
            </Row>
          )}
        </Card.Body>
      </Card>
      <SportFormModal show={showModal} handleClose={() => { setShowModal(false); setSelectedSport(null); }} handleSave={handleSave} selectedSport={selectedSport} />
    </>
  );
}

export default SportsManager;
