import React, { useState } from "react";
import {
  Container,
  Table,
  Form,
  Button,
  Spinner,
  Alert,
  Modal,
} from "react-bootstrap";
import axios from "axios";

const LogTable = () => {
  const [fechaInicio, setFechaInicio] = useState("2025-09-22");
  const [fechaFin, setFechaFin] = useState("2025-09-23");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        "https://analisisderedapi.vesta-accelerate.com/api/LogGestionCrud/GetLogByRangoFechas",
        { params: { FechaInicio: fechaInicio, FechaFin: fechaFin } }
      );
      setData(response.data);
    } catch (err) {
      setError("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  const handleShowModal = (entrada) => {
    setModalContent(JSON.stringify(entrada, null, 2));
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalContent(null);
  };

  return (
    <Container className="mt-4">
      <h2>Logs</h2>

      <Form className="mb-3 d-flex gap-2 align-items-end">
        <Form.Group>
          <Form.Label>Fecha Inicio</Form.Label>
          <Form.Control
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Fecha Fin</Form.Label>
          <Form.Control
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
          />
        </Form.Group>

        <Button onClick={fetchData} variant="primary">
          {loading ? <Spinner animation="border" size="sm" /> : "Buscar"}
        </Button>
      </Form>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>CodigoGestión</th>
            <th>Detalle</th>
            <th>Entrada</th>
            <th>FechaCreación</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center">
                {loading ? "Cargando..." : "No hay datos"}
              </td>
            </tr>
          ) : (
            data
              .filter((log) => log.Detalle?.includes("Sinay"))
              .map((log) => (
                <tr key={log.id}>
                  <td>{log.CodigoGestion}</td>
                  <td>{log.Detalle}</td>
                  <td>
                    <Button
                      variant="info"
                      size="sm"
                      onClick={() => handleShowModal(log.Entrada)}
                    >
                      Ver JSON
                    </Button>
                  </td>
                  <td>{log.CreatedDate}</td>
                </tr>
              ))
          )}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Contenido Entrada</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <pre>{modalContent}</pre>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default LogTable;
