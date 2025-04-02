import React from "react";
import { useForm } from "react-hook-form";
import { Form, Col, Row } from "react-bootstrap";

function Hr() {
  return (
    <>
      <Form>
        <Row>
          <Col>
            <label className="me-1">Nombre Solicitud hr</label>
            <input type="text" placeholder="Hoja de Ruta" />
            <label className="ms-1 me-1">Nombre Solicitud ar</label>
            <input type="text" placeholder="Asignar Referencia" />
          </Col>
        </Row>
        <Row>
          <Col>
            <label className="me-1">Nombre Encabezado</label>
            <input type="text" placeholder="Hoja de Ruta" />
            <label className="ms-1 me-1">Nombre Criterio</label>
            <input type="text" placeholder="Asignar Referencia" />
          </Col>
        </Row>
      </Form>
    </>
  );
}

export default Hr;
