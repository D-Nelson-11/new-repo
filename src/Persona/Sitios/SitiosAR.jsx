import { Form, Row, Col, Button } from "react-bootstrap";
import { set, useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import axios from "../../api/axios";

function SitioAnalisis() {
  const { handleSubmit, register, getValues, setValue } = useForm();
  const [tipoDeSitio, setTipoDeSitio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sitioPersona, setSitioPersona] = useState();
  const [disabled, setDisabled] = useState(true);
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    async function ObtenerDatos() {
      try {
        const resp = await axios.post(
          "https://analisisderedapi.vesta-accelerate.com/api/TipoSitioCrudApi/Index",
          {}
        );
        const resp2 = await axios.get('https://personasapi.vesta-accelerate.com/api/PersonaClienteServiceApi/GetAllClientes');
        setClientes(resp2.data.map((cliente) => ({ Id: cliente.Id, Nombre: cliente.Nombre })));
        setTipoDeSitio(resp.data.Message);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    }

    ObtenerDatos();
  }, []);

  const fetchData = async (sitioPersonaId) => {
    try {
      const resp = await axios.get(
        `https://personasapi.vesta-accelerate.com/api/SitioPersonaProveedorApi/Details/${sitioPersonaId}`
      );
      setSitioPersona(resp.data[0]);
      setValue("nombreSitio", resp.data[0].Nombre);  
    } catch (error) {
      alert("No se encontró el sitio");
      console.error(error);
    }
  };

  const onSubmit = async (values) => {
    let JsonSitioAr = {
      CoordenadaX: sitioPersona?.CoordenadaX,
      CoordenadaY: sitioPersona?.CoordenadaY,
      Nombre: sitioPersona?.Nombre,
      TipoSitioId: values.tipoDeSitio.split(",")[0],
      SitioPersonaId: sitioPersona?.Id,
      CreatedBy: "0C3A7B92-34D7-453A-883F-24C15B24FF6A",
      ClienteId: values.Cliente.split(",")[0],
      ClienteNombre: values.Cliente.split(",")[1],
      PaisId: sitioPersona?.PaisId,
      PaisNombre: sitioPersona?.PaisDescripcion,
      Url: "modelologisticoderedope.vesta-accelerate.com",
      SitioCodigo: sitioPersona.Nombre[0] + sitioPersona.Nombre[1]+ sitioPersona.Nombre[2],
      UsuarioAsignadoId: "0C3A7B92-34D7-453A-883F-24C15B24FF6A",
    };
    setValue("json", JSON.stringify(JsonSitioAr,null,2));
    setDisabled(false);
  };

  if (loading) {
    return <div>Calmate, estoy cargando...</div>;
  }

  return (
    <Row className="w-100">
      <Col md={6}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col className="col-9">
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>SitioPersonaId</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="SitioPersonaId"
                  {...register("SitioPersonaId")}
                />
              </Form.Group>
            </Col>
            <Col>
              <Button
                style={{
                  marginTop: "30px",
                  backgroundColor: "green",
                  border: "none",
                }}
                onClick={() => fetchData(getValues("SitioPersonaId"))}>
                Buscar
              </Button>
            </Col>
          </Row>
          <Row>
            <Col>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  // value={datos[0]?.Nombre}
                  placeholder="Nombre del sitio"
                  {...register("nombreSitio")}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Cliente</Form.Label>
                <Form.Select {...register("Cliente")}>
                  {clientes.map((cliente) => (
                    <option key={cliente.Id} value={[cliente.Id, cliente.Nombre]}>
                      {cliente.Nombre}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Tipo de sitio</Form.Label>
                <Form.Select {...register("tipoDeSitio")}>
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
              <Button className="w-100" variant="secondary" type="submit">
                generar JSON
              </Button>
            </Col>
            <Col>
              <Button className="w-100" variant="success" disabled={disabled} onClick={async()=>{
                try {
                  const confirmar = confirm('¿Está seguro de crear el sitio?');
                  if (!confirmar) return;
                  const resp = await axios.post('https://analisisderedapi.vesta-accelerate.com/api/SitioCrudApi/Create',JSON.parse(getValues('json')));
                  console.log(resp);  
                  alert('Sitio creado correctamente');
                } catch (error) {
                  alert('Error al crear el sitio');
                }
              }}>
                Crear
              </Button>
            </Col>
          </Row>
        </Form>
      </Col>
      <Col md={6}>
        <Form.Group className="mb-3" controlId="formTextarea">
          <Form.Label>JSON</Form.Label>
          <Form.Control as="textarea" rows={16} {...register('json')} />
        </Form.Group>
      </Col>
    </Row>
  );
}

export default SitioAnalisis;