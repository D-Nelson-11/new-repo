import { Form, Row, Col, Button } from "react-bootstrap";
import { set, useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import axios from "../../api/axios";

function Segmentos() {
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
        const resp2 = await axios.get(
          "https://personasapi.vesta-accelerate.com/api/PersonaClienteServiceApi/GetAllClientes"
        );
        setClientes(
          resp2.data
            .map((cliente) => ({
              Id: cliente.Id,
              Nombre: cliente.Nombre,
            }))
            .sort((a, b) => a.Nombre.localeCompare(b.Nombre)) // Ordenar alfabéticamente
        );
        setTipoDeSitio(
          resp.data.Message.sort((a, b) => a.Nombre.localeCompare(b.Nombre))
        );
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    }

    ObtenerDatos();
  }, []);

  const onSubmit = async (values) => {
    let JsonSitioAr = {
        "TipoSegmentoId":values.TipoSegmentoId,
        "Sitio1Id": values.Sitio1Id,
        "Sitio2Id": values.Sitio2Id,
        "Kilometros": values.Kilometros,
        "ParadasAutorizadas": 0,
        "Observacion": values.TipoSegmentoId == "7a907087-bdb2-4ac9-8e1b-15ca306b99c2" ? "TRÁNSITO SEGÚN GOOGLE MAPS" : values.TipoSegmentoId == "c9d2440e-8afa-4051-9be6-15ca30342223" ? "TRÁNSITO SEGÚN SEARATES" : "N/D",
        "CreatedBy": "0C3A7B92-34D7-453A-883F-24C15B24FF6A",
        "ClienteId": values.Cliente.split(",")[0],
        "ClienteNombre": values.Cliente.split(",")[1],
      };
    setValue("json", JSON.stringify(JsonSitioAr, null, 2));
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
            <Col>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Tipo de segmento</Form.Label>
                <Form.Select {...register("TipoSegmentoId")}>
                  <option>Seleccione</option>
                  <option value="7a907087-bdb2-4ac9-8e1b-15ca306b99c2">
                    terrestre
                  </option>
                  <option value="c9d2440e-8afa-4051-9be6-15ca30342223">
                    marítimo
                  </option>
                  <option value="3938f60a-10be-4500-92dc-15ca2fc905bb">
                    áereo
                  </option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Sitio1</Form.Label>
                <Form.Control
                  type="text"
                  // value={datos[0]?.Nombre}
                  placeholder="Nombre del sitio"
                  {...register("Sitio1Id")}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Sitio2</Form.Label>
                <Form.Control
                  type="text"
                  // value={datos[0]?.Nombre}
                  placeholder="sitio2"
                  {...register("Sitio2Id")}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Kilometros</Form.Label>
                <Form.Control
                  type="text"
                  // value={datos[0]?.Nombre}
                  placeholder="kilometros"
                  {...register("Kilometros")}
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
                    <option
                      key={cliente.Id}
                      value={[cliente.Id, cliente.Nombre]}>
                      {cliente.Nombre}
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
              <Button
                className="w-100"
                variant="success"
                disabled={disabled}
                onClick={async () => {
                  try {
                    const confirmar = confirm(
                      "¿Está seguro de crear el segmento?"
                    );
                    if (!confirmar) return;
                    const resp = await axios.post(
                      "https://analisisderedapi.vesta-accelerate.com/api/SegmentoCrudApi/Create",
                      JSON.parse(getValues("json"))
                    );
                    alert(resp.data.Message.Id);
                    console.log(resp);
                    alert("Segmento creado correctamente");
                  } catch (error) {
                    alert("Error, revisá si los kilometros están bien, o si los sitios peretenecen al cliente seleccionado");
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
          <Form.Control as="textarea" rows={16} {...register("json")} />
        </Form.Group>
      </Col>
    </Row>
  );
}

export default Segmentos;