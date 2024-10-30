import { Form, Row, Col, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import axios from "../../api/axios";

function SitioAnalisis() {
  const { handleSubmit, register } = useForm();
  const [paises, setPaises] = useState([]);
  const [tipoDeSitio, setTipoDeSitio] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [loading, setLoading] = useState(true); // Estado de carga
  const [tipoSitio, setTipoSitio] = useState(1);
  let parsedResp = {};

  useEffect(() => {
    async function ObtenerDatos() {
      try {
        const respTipoDeSitio = await axios.get("http://localhost:4000/api/obtenerTiposDesitioAR");
        setTipoDeSitio(respTipoDeSitio.data); // Llenar el estado de tipo de sitio
        console.log(respTipoDeSitio.data);
        setLoading(false); // Cambiar el estado de carga
      } catch (error) {
        console.error(error);
        setLoading(false); // Asegurarse de cambiar el estado de carga aunque ocurra un error
      }
    }

    ObtenerDatos();
  }, []); // Ejecutar solo una vez al montar el componente

  const onSubmit = async (data) => {
     
  };

  if (loading) {
    return <div>Cargando...</div>; // Mostrar un indicador de carga
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Row>
        <Col>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>ClienteId</Form.Label>
            <Form.Control
              type="text"
              placeholder="PersonaJuridicaClienteId"
              {...register("PersonaJuridicaClienteId")}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Cliente Nombre</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nombre"
              {...register("ClienteNombre")}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>SitioPersonaId</Form.Label>
            <Form.Control
              type="text"
              placeholder="SitioPersonaId"
              {...register("SitioPersonaId")}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Pais</Form.Label>
            <Form.Select {...register("PaisId")}>
              {tipoDeSitio.map((sitio) => (
                <option key={sitio.Id} value={[sitio.Id, sitio.Nombre]}>
                  {sitio.Nombre}
                </option>
              ))}
            </Form.Select>
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

export default SitioAnalisis;
