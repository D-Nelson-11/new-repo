// SegmentoModal.jsx
import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

export function TimelineModalSegmentos({
  show,
  onClose,
  segmento,
  editing,
  setEditing,
  formEditSegmento,
  handleEditSubmitSegmento,
}) {
  if (!segmento) return null;

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title style={{ fontSize: "14px" }}>Detalles del segmento</Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ fontSize: "12px" }}>
        {editing ? (
          <Form onSubmit={formEditSegmento.handleSubmit(handleEditSubmitSegmento)}>
            <div className="mb-2 d-flex align-items-center">
              <span style={{ width: "80px", fontSize: "12px" }}>Orden:</span>
              <Form.Control
                type="text"
                defaultValue={segmento.Orden || ""}
                {...formEditSegmento.register("Orden")}
                className="p-0 border-0 border-bottom"
                style={{ fontSize: "12px" }}
              />
            </div>
            <Button variant="success" size="sm" type="submit">
              Guardar
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="ms-2"
              onClick={() => setEditing(false)}
            >
              Cancelar
            </Button>
          </Form>
        ) : (
          <>
            <div style={{ marginBottom: "5px" }}>
              <strong>De:</strong> {segmento.Segmento?.Sitio1?.Nombre || "N/A"}
            </div>
            <div style={{ marginBottom: "5px" }}>
              <strong>A:</strong> {segmento.Segmento?.Sitio2?.Nombre || "N/A"}
            </div>
            <div>
              <strong>ID:</strong> {segmento.Segmento?.Id || "N/A"} <br />
              <strong>Orden:</strong> {segmento.Orden || "N/A"}
            </div>
            <button
              style={{
                marginTop: "10px",
                padding: "6px 12px",
                border: "none",
                borderRadius: "4px",
                background: "green",
                color: "#fff",
                cursor: "pointer",
              }}
              onClick={() => setEditing(true)}
            >
              Editar
            </button>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
}
