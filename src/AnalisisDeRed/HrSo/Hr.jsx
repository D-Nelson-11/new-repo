import { useForm } from "react-hook-form";
import { Form, Col, Row, Container, Button } from "react-bootstrap";
import axios from "../../api/axios";
import { useState, useEffect } from "react";
import { parametrosHr } from "./parámetrosHr";
import { toast } from "sonner";

function Hr() {
  const { register, handleSubmit } = useForm();
  let [parametros, setparametros] = useState(false);
  let [textAreaValue, setTextAreaValue] = useState("");
  let [textAreaValue2, setTextAreaValue2] = useState("");

  return (
    <Container fluid className="mt-3">
      <Form
        onSubmit={handleSubmit(async (data) => {
          const confirmar = confirm(
            "¿Está seguro de que desea crear la solicitud?"
          );
          if (!confirmar) return;

          await toast.promise(
            (async () => {
              // CREAR SOLICITUD HR
              let json1 = {
                Nombre: data.NombreSolicitudHr,
                CreatedBy: "0C3A7B92-34D7-453A-883F-24C15B24FF6A",
                SistemaId: "19667294-D673-4C55-B1AF-1900833C7D52",
                MetodoNombre: "CrearHojaRuta",
                EsDiferido: false,
              };
              const resp1 = await axios.post(
                "https://analisisderedapi.vesta-accelerate.com/api/TipoSolicitudCrudApi/Create",
                json1
              );
              console.log("tipoSolicitudHr: " + resp1.data.Id);

              // CREAR SOLICITUD AR
              let json2 = {
                Nombre: data.NombreSolicitudAr,
                CreatedBy: "0C3A7B92-34D7-453A-883F-24C15B24FF6A",
                SistemaId: "62B010A8-F266-4422-BAA3-1900831A2E06",
                MetodoNombre: "AsignarReferenciaOperativaHojaRutaAGestion",
                EsDiferido: false,
              };
              const resp2 = await axios.post(
                "https://analisisderedapi.vesta-accelerate.com/api/TipoSolicitudCrudApi/Create",
                json2
              );
              console.log("tipoSolicitudAr: " + resp2.data.Id);

              // CREAR ENCABEZADO
              let json3 = {
                Descripcion: data.NombreEncabezado,
                UsuarioId: "0C3A7B92-34D7-453A-883F-24C15B24FF6A",
              };
              const resp3 = await axios.post(
                "https://analisisderedapi.vesta-accelerate.com/api/EncabezadoTipoSolicitudApi/Create",
                json3
              );
              console.log("Id Encabezado: " + resp3.data.Id);

              // RELACIÓN DE HR Y AR
              const json4 = {
                UsuarioId: "0C3A7B92-34D7-453A-883F-24C15B24FF6A",
                TipoSolicitudes: [
                  { Id: resp1.data.Id, Orden: 1 },
                  { Id: resp2.data.Id, Orden: 2 },
                ],
                EncabezadoSolicitudId: resp3.data.Id,
              };
              const resp4 = await axios.post(
                "https://analisisderedapi.vesta-accelerate.com/api/EncabezadoTipoSolicitudApi/AddTipoSolicitud",
                json4
              );
              console.log("Relación de HR y AR: " + resp4.data.Id);

              // CREAR CRITERIO HR
              const json5 = {
                SistemaId: "62b010a8-f266-4422-baa3-1900831a2e06",
                TipoReferenciaId: 5,
                Criterio: data.NombreCriterio,
                TipoCriterio: 1,
                Operador: 3,
                Diferido: false,
                MetodoNombre: "GetRutaByGestionId",
                Campos: [{ NombreCampo: "GestionId", Fixed: true, Orden: 1 }],
                EsDeAnalisis: true,
                CreatedBy: "0C3A7B92-34D7-453A-883F-24C15B24FF6A",
              };
              const resp5 = await axios.post(
                "https://analisisderedapi.vesta-accelerate.com/api/CriterioCrudApi/Create",
                json5
              );
              console.log("CriterioId: " + resp5.data.Id);

              // RELACIÓN DE CRITERIO Y ENCABEZADO
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

              // ÚLTIMOS PASOS
              let nuevoJsonTextArea = JSON.parse(
                textAreaValue.replace(/'/g, '"')
              );
              nuevoJsonTextArea.TipoSolicitudId = resp1.data.Id;
              const resp7 = await axios.post(
                "https://analisisderedapi.vesta-accelerate.com/api/TipoSolicitudParametroCrudApi/CreateWithMuchosParametrosId",
                nuevoJsonTextArea
              );

              let nuevoJsonTextArea2 = JSON.parse(
                textAreaValue2.replace(/'/g, '"')
              );
              nuevoJsonTextArea2.TipoSolicitudId = resp2.data.Id;
              const resp8 = await axios.post(
                "https://analisisderedapi.vesta-accelerate.com/api/TipoSolicitudParametroCrudApi/CreateWithMuchosParametrosId",
                nuevoJsonTextArea2
              );

              return { resp7, resp8 };
            })(),
            {
              loading: "Creando Matriz Hoja de Ruta",
              success: () => "Solicitud creada con éxito",
              error: () => "Error al crear la solicitud",
            }
          );
        })}>
        <div className="d-flex">
          <div style={{ width: "30%", marginRight: "5px" }}>
            <Row>
              <Col className="col-12">
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1">
                  <Form.Label>Nombre Encabezado</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="EJ: OPERACION HR  AZUNOSA 4000 LA MESA"
                    {...register("NombreEncabezado", { required: true })}
                  />
                </Form.Group>
              </Col>
              <Col className="col-12">
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1">
                  <Form.Label>Nombre Solicitud Hoja de Ruta</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="HR-AZUNOSA LA MESA 4000"
                    {...register("NombreSolicitudHr", { required: true })}
                  />
                </Form.Group>
              </Col>
              <Col className="col-12">
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1">
                  <Form.Label>Nombre Solicitud Asignar Referencia</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="AR-AZUNOSA LA MESA 4000"
                    {...register("NombreSolicitudAr", { required: true })}
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
                    placeholder="RUTAS-HR AZUNOSA 4000 LA MESA"
                    {...register("NombreCriterio", { required: true })}
                  />
                </Form.Group>
              </Col>
              <Col className="col-12">
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1">
                  <Form.Label>Aduana</Form.Label>
                  <Form.Select
                    onChange={(e) => {
                      let json1 = {
                        TipoSolicitudId: "Aquí va el tipo de solicitud HR",
                        ParametrosId: parametrosHr[e.target.value][0],
                        CreatedBy: "0C3A7B92-34D7-453A-883F-24C15B24FF6A",
                      };
                      setTextAreaValue(
                        JSON.stringify(json1, null, 2).replace(/"/g, "'")
                      );

                      let json2 = {
                        TipoSolicitudId: "Aquí va el tipo de solicitud AR",
                        ParametrosId: parametrosHr[e.target.value][1],
                        CreatedBy: "0C3A7B92-34D7-453A-883F-24C15B24FF6A",
                      };
                      setTextAreaValue2(
                        JSON.stringify(json2, null, 2).replace(/"/g, "'")
                      );
                    }}>
                    <option value="">--Seleccione--</option>
                    <option value="0">Amatillo</option>
                    <option value="1">El Poy</option>
                    <option value="2">Puerto Cortés</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Button className="w-100" variant="success" type="submit">
                  Crear
                </Button>
              </Col>
            </Row>
          </div>
          <div style={{ width: "35%", marginRight: "5px" }}>
            <textarea
              style={{ width: "100%", height: "550px" }}
              value={textAreaValue}
              onChange={(e) => setTextAreaValue(e.target.value)}></textarea>
          </div>
          <div style={{ width: "35%" }}>
            <textarea
              style={{ width: "100%", height: "550px" }}
              value={textAreaValue2}
              onChange={(e) => setTextAreaValue2(e.target.value)}></textarea>
          </div>
        </div>
      </Form>
    </Container>
  );
}

export default Hr;
