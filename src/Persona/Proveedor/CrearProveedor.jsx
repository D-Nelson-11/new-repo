import { Form, Row, Col, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import axios from "../../api/axios";

function CrearProveedor() {
  const { handleSubmit, register } = useForm();
  const [loading, setLoading] = useState(true);
  const [tiposFiscales, setTipoFiscal] = useState([]);
  const [grupoPersona, setGrupoPersona] = useState([]);
  const [segmento, setSegmento] = useState([]);

  let parsedResp = {};

  useEffect(() => {
    async function ObtenerDatos() {
      try {
        const resp = await axios.get(
          "https://personasapi.vesta-accelerate.com/api/TipoIdFiscalApi/Index"
        );
        setTipoFiscal(resp.data);
        const resp2 = await axios.get(
          "https://personasapi.vesta-accelerate.com/api/GrupoPersonaCrudApi/Index"
        );
        setGrupoPersona(resp2.data);
        const resp3 = await axios.get(
          "https://personasapi.vesta-accelerate.com/api/SegmentoCrudApi/Index"
        );
        setSegmento(resp3.data);
        setLoading(false); // Mostrar un indicador de carga
      } catch (error) {
        console.error("Error al obtener los datos", error);
        setLoading(false); // Asegurarse de cambiar el estado de carga aunque ocurra un error
      }
    }
    ObtenerDatos();
  }, []); // Ejecutar solo una vez al montar el componente

  const onSubmit = async (data) => {
    console.log(data);
    let json = {
      Nombre: data.Nombre,
      IdFiscal:data.IdFiscal,
      TipoIdFiscalId: data.TipoIdFiscalId.split(",")[0],
      TipoIdFiscalDescripcion: data.TipoIdFiscalId.split(",")[1],
      GrupoPersonaId: data.GrupoPersona.split(",")[0],
      GrupoPersonaNombre: data.GrupoPersona.split(",")[1],
      PaisId: data.PaisId,
      PaisDescripcion: data.PaisDescripcion,
      SegmentoId: data.segmento.split(",")[0],
      SegmentoNombre: data.segmento.split(",")[1],
      Referencia: data.Nombre[0] + data.Nombre[1] + data.Nombre[2],
    };
    const resp = await axios.post('https://personasapi.vesta-accelerate.com/api/ProveedorServiceApi/Create', json);
    console.log(resp);
  };

  if (loading) {
    return <div>Cargando...</div>; // Mostrar un indicador de carga
  }

  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      className="m-auto border border-1 p-4 rounded-2 w-75">
        <Row>
        <Col>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Id Fiscal</Form.Label>
            <Form.Control
              type="text"
              placeholder="Id Fiscal"
              {...register("IdFiscal")}
            />
          </Form.Group>
        </Col>
        </Row>
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
            <Form.Select {...register("GrupoPersona")}>
              {grupoPersona.map((grupo) => (
                <option key={grupo.Id} value={[grupo.Id, grupo.Nombre]}>
                  {grupo.Nombre}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Segmento</Form.Label>
            <Form.Select {...register("segmento")}>
              {segmento.map((seg) => (
                <option key={seg.Id} value={[seg.Id, seg.Nombre]}>
                  {seg.Nombre}
                </option>
              ))}
            </Form.Select>
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
              {...register("PaisId")}
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
