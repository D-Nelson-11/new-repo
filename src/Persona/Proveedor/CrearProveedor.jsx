import { Form, Row, Col, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import axios from "../../api/axios";

function CrearProveedor() {
  const { handleSubmit, register } = useForm();
  const [loading, setLoading] = useState(true);
  const [tiposFiscales, setTipoFiscal] = useState([]);
  const [grupoPersona, setGrupoPersona] = useState([]);

  let parsedResp = {};

  useEffect(() => {
    async function ObtenerDatos() {
      try {
        setLoading(false); // Mostrar un indicador de carga
      } catch (error) {
        console.error("Error al obtener los datos", error);
        setLoading(false); // Asegurarse de cambiar el estado de carga aunque ocurra un error
      }
    }

    ObtenerDatos();
  }, []); // Ejecutar solo una vez al montar el componente

  const onSubmit = async (data) => {};

  if (loading) {
    return <div>Cargando...</div>; // Mostrar un indicador de carga
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className ="m-auto border border-1 p-4 rounded-2 w-75">
      <Row>
        <Col>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nombre"
              {...register("Nombre")}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>TipoIdFiscalId</Form.Label>
            <Form.Select {...register("TipoIdFiscalId")}>
              {tiposFiscales.map((tipoF) => (
                <option key={tipoF.Id} value={[tipoF.Id, tipoF.Descripcion]}>
                  {tipoF.Descripcion}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Grupo Persona</Form.Label>
            <Form.Select {...register("TipoIdFiscalId")}>
              {grupoPersona.map((grupoPersona) => (
                <option
                  key={grupoPersona.Id}
                  value={[grupoPersona.Id, grupoPersona.Descripcion]}>
                  {grupoPersona.Descripcion}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Coordenada Y</Form.Label>
            <Form.Control
              type="text"
              placeholder="Coordenada Y"
              {...register("CoordenadaY")}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Pais Descipcion</Form.Label>
            <Form.Control
              type="text"
              placeholder="PaisDescripcion"
              {...register("PaisDescripcion")}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Pais Id</Form.Label>
            <Form.Control
              type="text"
              placeholder="PaisId"
              {...register("Direccion")}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col>
          <Button className="w-100" type="submit">
            Enviar
          </Button>
        </Col>
      </Row>
    </Form>
  );
}

export default CrearProveedor;
