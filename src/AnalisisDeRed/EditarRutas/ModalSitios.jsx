// TimelineModal.jsx
import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

export function TimelineModalSitios({
  show,
  onClose,
  item,
  editing,
  setEditing,
  formEdit,
  handleEditSubmit,
}) {
  if (!item) return null;

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title style={{ fontSize: "14px" }}>Detalles del sitio</Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ fontSize: "12px" }}>
        {editing ? (
          <Form onSubmit={formEdit.handleSubmit(handleEditSubmit)}>
            <div className="mb-2 d-flex align-items-center">
              <span style={{ width: "80px" }}>DE:</span>
              <Form.Control
                type="text"
                defaultValue={item.DuracionEntrada || ""}
                {...formEdit.register("DuracionEntrada")}
                className="p-0 border-0 border-bottom"
                style={{ fontSize: "12px" }}
              />
            </div>
            <div className="mb-2 d-flex align-items-center">
              <span style={{ width: "80px" }}>DS:</span>
              <Form.Control
                type="text"
                defaultValue={item.DuracionSalida || ""}
                {...formEdit.register("DuracionSalida")}
                className="p-0 border-0 border-bottom"
                style={{ fontSize: "12px" }}
              />
            </div>
            <div className="mb-2 d-flex align-items-center">
              <span style={{ width: "80px" }}>Régimen:</span>
              <Form.Control
                type="text"
                defaultValue={item.Regimen || ""}
                {...formEdit.register("Regimen")}
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
            <strong>Sitio:</strong> {item.Sitio?.Nombre || "Sin nombre"} <br />
            <strong>ID:</strong> {item.Sitio?.Id || "N/A"} <br />
            <strong>SitioPersonaId:</strong> {item.Sitio?.SitioPersonaId || "N/A"} <br />
            <strong>Orden:</strong> {item.Orden || "N/A"} <br />
            <strong>Régimen:</strong> {item.Regimen || "N/A"} <br />
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
