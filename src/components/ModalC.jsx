import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useState } from "react";
import { MdModeEdit } from "react-icons/md";

function ModalC({ ContenidoModal, Nombre }) {
  const [smShow, setSmShow] = useState(false);
  const [lgShow, setLgShow] = useState(false);

  return (
    <>
      {Nombre === "Editar" ? (
        <MdModeEdit
          style={{
            fontSize: "20px",
            color: "green",
            cursor: "pointer",
          }}
          title="editar"
          onClick={() => setLgShow(true)}
        />
      ) : (
        <Button
          onClick={() => setLgShow(true)}
          style={{ backgroundColor: "#4a5a85", border: "none" }}>
          {Nombre}
        </Button>
      )}

      <Modal
        size= {Nombre === "Editar" ? "md" : "xl"}
        show={lgShow}
        backdrop="static"
        onHide={() => setLgShow(false)}
        aria-labelledby="example-modal-sizes-title-lg">
        <Modal.Header closeButton />
        <Modal.Body
          className="d-flex justify-content-between"
          style={{ height: Nombre === "Editar" ? "auto" : "630px" }}>
          {ContenidoModal}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ModalC;
