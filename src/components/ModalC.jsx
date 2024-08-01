import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useState } from "react";


function ModalC({ContenidoModal,Nombre}) {
    const [smShow, setSmShow] = useState(false);
    const [lgShow, setLgShow] = useState(false);
  
    return (
      <>
        <Button onClick={() => setLgShow(true)}>{Nombre}</Button>
        <Modal
          size="xl"
          show={lgShow}
          onHide={() => setLgShow(false)}
          aria-labelledby="example-modal-sizes-title-lg">
          <Modal.Header closeButton />
          <Modal.Body className="d-flex justify-content-between" style={{height:"630px"}}>
            {ContenidoModal}
          </Modal.Body>
        </Modal>
      </>
    );
  }

  export default ModalC