import { useForm } from "react-hook-form";
import { Form, Col, Row, Container, Button } from "react-bootstrap";
import axios from "../../api/axios";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { parametrosSO, segmentosSo } from "./parametros";
import Clientes from "../../components/ClientesSelect";
import CreatedBy from "../../components/CreatedBy";
function So() {
  const { register, handleSubmit, getValues } = useForm();
  let [parametros, setparametros] = useState(false);
  let [accion, setAccion] = useState(2);
  let [criteriosACambiar, setCriteriosACambiar] = useState(0);
  let [textAreaValue, setTextAreaValue] = useState("");
  let [negociaciones, setNegociaciones] = useState([]);

  useEffect(() => {
    console.log("ClienteId", getValues("IdCliente"));
  }, [getValues("IdCliente")]);

  return (
    <Container fluid className="mt-3">
      <div className="d-flex">
        <div style={{ width: "45%" }}>
          <Form
            onSubmit={handleSubmit((data) => {
              let confirmarAccion = confirm(
                "¿Está seguro de crear la solicitud?"
              );
              if (!confirmarAccion) return;
              toast.promise(
                (async () => {
                  let parametroPadre = "";
                  let parametroPadreDeLosRestantes = "";

                  // CREAR SOLICITUD HR
                  let json1 = {
                    Nombre: data.NombreSolicitudSo,
                    CreatedBy: "0C3A7B92-34D7-453A-883F-24C15B24FF6A",
                    SistemaId: "bcce4b11-4231-4e0e-bc9b-1b8230b485e8",
                    MetodoNombre: "CrearSalesOrder",
                    EsDiferido: false,
                  };
                  const resp1 = await axios.post(
                    "https://analisisderedapi.vesta-accelerate.com/api/TipoSolicitudCrudApi/Create",
                    json1
                  );
                  console.log("tipoSolicitudSo: " + resp1.data.Id);

                  // CREAR ENCABEZADO SOLICITUD
                  let json3 = {
                    Descripcion: data.NombreEncabezado,
                    UsuarioId: "0C3A7B92-34D7-453A-883F-24C15B24FF6A",
                  };
                  const resp3 = await axios.post(
                    "https://analisisderedapi.vesta-accelerate.com/api/EncabezadoTipoSolicitudApi/Create",
                    json3
                  );
                  console.log("Id Encabezado: " + resp3.data.Id);

                  // CREAR UNIÓN DE SOLICITUD Y ENCABEZADO
                  const json4 = {
                    UsuarioId: "0C3A7B92-34D7-453A-883F-24C15B24FF6A",
                    TipoSolicitudes: [{ Id: resp1.data.Id, Orden: 1 }],
                    EncabezadoSolicitudId: resp3.data.Id,
                  };
                  const resp4 = await axios.post(
                    "https://analisisderedapi.vesta-accelerate.com/api/EncabezadoTipoSolicitudApi/AddTipoSolicitud",
                    json4
                  );
                  console.log("Relación de SO y encabezado: " + resp4.data.Id);

                  // CREAR CRITERIO HR
                  const json5 = {
                    SistemaId: "62b010a8-f266-4422-baa3-1900831a2e06",
                    TipoReferenciaId: 2,
                    Criterio: data.NombreCriterio,
                    TipoCriterio: 1,
                    Operador: 3,
                    Diferido: false,
                    MetodoNombre: "GetRutaByGestionId",
                    Campos: [
                      { NombreCampo: "GestionId", Fixed: true, Orden: 1 },
                    ],
                    EsDeAnalisis: true,
                    CreatedBy: "0C3A7B92-34D7-453A-883F-24C15B24FF6A",
                  };
                  const resp5 = await axios.post(
                    "https://analisisderedapi.vesta-accelerate.com/api/CriterioCrudApi/Create",
                    json5
                  );
                  console.log("CriterioId: " + resp5.data.Id);

                  // CREAR UNIÓN DE CRITERIO Y ENCABEZADO
                  const json6 = {
                    CriterioAnalisisId: resp5.data.Id,
                    EncabezadoSolicitudId: resp3.data.Id,
                    CreatedBy: "0C3A7B92-34D7-453A-883F-24C15B24FF6A",
                  };
                  const resp6 = await axios.post(
                    "https://analisisderedapi.vesta-accelerate.com/api/CriterioAnalisisEncabezadoSolicitudCrudApi/Create",
                    json6
                  );
                  console.log("CriterioAnalisisEncabezadoId: " + resp6.data.Id);

                  // CREAR PARÁMETROS SEGMENTOS
                  for (let i = 0; i < segmentosSo.length; i++) {
                    if (i === 0) {
                      let resp = await axios.post(
                        "https://analisisderedapi.vesta-accelerate.com/api/ParametroRequeridoCrudApi/CrearParametroTipoSolicitud",
                        segmentosSo[i]
                      );
                      parametroPadre = resp.data.Message.Id;
                      console.log("Segmento 0", segmentosSo[i]);
                    }

                    if (i === 1 || i === 2) {
                      segmentosSo[i].ParametroPadreId = parametroPadre;
                      if (i === 2) {
                        let resp = await axios.post(
                          "https://analisisderedapi.vesta-accelerate.com/api/ParametroRequeridoCrudApi/CrearParametroTipoSolicitud",
                          segmentosSo[i]
                        );
                        parametroPadreDeLosRestantes = resp.data.Message.Id;
                        console.log("Segmento 2", segmentosSo[i]);
                      } else {
                        await axios.post(
                          "https://analisisderedapi.vesta-accelerate.com/api/ParametroRequeridoCrudApi/CrearParametroTipoSolicitud",
                          segmentosSo[i]
                        );
                        console.log("Segmento 1", segmentosSo[i]);
                      }
                    }

                    if (i > 2) {
                      segmentosSo[i].ParametroPadreId =
                        parametroPadreDeLosRestantes;
                      if (i === 4)
                        segmentosSo[i].ValorDefecto =
                          data.NombreComponente.split("/")[0];
                      if (i === 6)
                        segmentosSo[i].ValorDefecto =
                          data.NombreComponente.split("/")[1];
                      if (i === 8)
                        segmentosSo[i].ValorDefecto =
                          data.NombreComponente.split("/")[2];
                      if (i === 10)
                        segmentosSo[i].ValorDefecto =
                          data.NombreComponente.split("/")[3];

                      await axios.post(
                        "https://analisisderedapi.vesta-accelerate.com/api/ParametroRequeridoCrudApi/CrearParametroTipoSolicitud",
                        segmentosSo[i]
                      );
                      console.log("Segmento " + i, segmentosSo[i]);
                    }
                  }

                  // CREAR ÚLTIMO PASO
                  let nuevoJsonTextArea = JSON.parse(
                    textAreaValue.replace(/'/g, '"')
                  );
                  nuevoJsonTextArea.TipoSolicitudId = resp1.data.Id;
                  nuevoJsonTextArea.ParametrosId.push(parametroPadre);

                  let ultimoPaso = await axios.post(
                    "https://analisisderedapi.vesta-accelerate.com/api/TipoSolicitudParametroCrudApi/CreateWithMuchosParametrosId",
                    nuevoJsonTextArea
                  );
                  console.log(ultimoPaso.data);

                  return ultimoPaso;
                })(),
                {
                  loading: "Generando...",
                  success: () => "Todo se realizó con éxito",
                  error: () => "Error al crear la solicitud",
                }
              );
            })}>
            <Row>
              <Col className="col-12">
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1">
                  <Form.Label>Nombre Encabezado</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nombre"
                    {...register("NombreEncabezado", { required: true })}
                  />
                </Form.Group>
              </Col>
              <Col className="col-12">
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1">
                  <Form.Label>Nombre Tipo Solicitud</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nombre"
                    {...register("NombreSolicitudSo", { required: true })}
                  />
                </Form.Group>
              </Col>

              <Col className="col-12">
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1">
                  <Form.Label>Nombre Criterio</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nombre"
                    {...register("NombreCriterio", { required: true })}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col className="col-12">
                <Form.Group>
                  <Form.Label>Nombre del componente</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="ej: DUCA-D/IMPORT/LA MESA/AZN"
                    {...register("NombreComponente", { required: true })}
                  />
                </Form.Group>
              </Col>
              <Col className="col-12">
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1">
                  <Form.Label>Aduana</Form.Label>
                  <Form.Select
                    {...register("Aduana", { required: true })}
                    onChange={(e) => {
                      let json = {
                        TipoSolicitudId: "Aquí va el tipo de solicitud",
                        ParametrosId: parametrosSO[e.target.value],
                        CreatedBy: "0C3A7B92-34D7-453A-883F-24C15B24FF6A",
                      };
                      setTextAreaValue(
                        JSON.stringify(json, null, 2).replace(/"/g, "'")
                      );
                    }}>
                    <option value="">-Seleccione-</option>
                    <option value="0">Puerto Cortés</option>
                    <option value="1">La Mesa</option>
                    <option value="2">Las manos</option>
                    <option value="3">El Florido</option>
                    <option value="4">Guasaule</option>
                    <option value="5">Amatillo</option>
                    <option value="6">Corinto</option>
                    <option value="7">Toncontín</option>
                    <option value="8">El Poy</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col className="col-12">
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1">
                  <Form.Label>Creado Por</Form.Label>
                  <Form.Select
                    {...register("CreatedBy", { required: true })}>
                    <option value="">-Seleccione-</option>
                    <option value="C183E6D0-6855-4613-A85D-24F1E30E165E">Fredy</option>
                    <option value="0C3A7B92-34D7-453A-883F-24C15B24FF6A">David</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              {/* <Col className="col-3">
                    <Form.Group
                      className="mb-3"
                      controlId="exampleForm.ControlInput1">
                      <Form.Label>Acción</Form.Label>
                      <Form.Select
                        {...register("Accion", { required: true })}
                        onChange={(e) => setAccion(e.target.value)}>
                        <option value="">-Seleccione-</option>
                        <option value={0}>Crear</option>
                        <option value={1}>Replicar</option>
                      </Form.Select>
                    </Form.Group>
                  </Col> */}
            </Row>
            {accion == 1 && (
              <div className="d-flex border p-3 rounded-3 bg-light">
                <div className="w-50 me-2">
                  <Form.Group>
                    <Form.Label>ComponenteId a replicar</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="componenteId"
                      {...register("ComponenteIdAReplicar", {
                        required: true,
                      })}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Criterios a cambiar</Form.Label>
                    <Form.Control
                      min={0}
                      type="number"
                      placeholder="Ej: 2"
                      {...register("CriteriosACambiar", { required: true })}
                      onChange={(e) => setCriteriosACambiar(e.target.value)}
                    />
                  </Form.Group>
                </div>
                <div className="w-50">
                  {[...Array(Number(criteriosACambiar))].map((e, i) => (
                    <Row key={i}>
                      <Col>
                        <Form.Group>
                          <Form.Label>CriterioId {i + 1}</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="CriterioId"
                            {...register(`NombreCriterio_${i}`, {
                              required: true,
                            })}
                          />
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group>
                          <Form.Label>Descripción</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Descripción"
                            {...register(`NombreCriterio_${i}`, {
                              required: true,
                            })}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  ))}
                </div>
              </div>
            )}
            {accion == 0 && (
              <Row className="rounded-3 bg-light p-3">
                <Col className="col-8">
                  <Form.Group>
                    <Form.Label>Cliente</Form.Label>
                    <Clientes register={register} />
                  </Form.Group>
                </Col>
                <Col className="col-4">
                  <Button
                    className="bg-secondary border border-0"
                    style={{ marginTop: "30px" }}
                    onClick={async () => {
                      const resp = await axios.post(
                        "https://analisisderedapi.vesta-accelerate.com/api/ParametroRequeridoCrudApi/CrearParametroTipoSolicitud",
                        { ClienteId: getValues("IdCliente").split(",")[0] }
                      );
                      console.log(resp.data);
                    }}>
                    Buscar Negociaciones
                  </Button>
                </Col>
                <Form.Group>
                  <Form.Label>Negociación</Form.Label>
                  <Form.Select>
                    <option value="">perro</option>
                  </Form.Select>
                </Form.Group>
              </Row>
            )}
            <Row>
              <Col>
                <Button className="w-100 mt-2" variant="success" type="submit">
                  Crear
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
        <div style={{ width: "55%" }} className="ms-3">
          <textarea
            style={{ width: "100%", height: "560px" }}
            onChange={(e) => setTextAreaValue(e.target.value)}
            value={textAreaValue}></textarea>
        </div>
      </div>
    </Container>
  );
}

export default So;
