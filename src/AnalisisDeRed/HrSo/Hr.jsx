import { useForm } from "react-hook-form";
import { Form, Col, Row, Container, Button } from "react-bootstrap";
import axios from "../../api/axios";
import { useState, useEffect } from "react";

function Hr() {
  const { register, handleSubmit } = useForm();
  let [parametros, setparametros] = useState(false);
  return (
    <Container fluid className="mt-3">
      <Form
        onSubmit={handleSubmit(async (data) => {
          let confirmar = confirm(
            "¿Está seguro de que desea crear la solicitud?"
          );
          if (!confirmar) {
            return;
          }
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

          // CREAR UNIÓN DE HR Y AR
          const json4 = {
            UsuarioId: "0C3A7B92-34D7-453A-883F-24C15B24FF6A",
            TipoSolicitudes: [
              {
                Id: resp1.data.Id,
                Orden: 1,
              },
              {
                Id: resp2.data.Id,
                Orden: 2,
              },
            ],
            EncabezadoSolicitudId: resp3.data.Id,
          };

          const resp4 = await axios.post(
            "https://analisisderedapi.vesta-accelerate.com/api/EncabezadoTipoSolicitudApi/AddTipoSolicitud",
            json4
          );
          console.log("Relación de HR Y AR: " + resp4.data.Id);

          // CREAR CRITERIO HR
          const json5 = {
            SistemaId: "62b010a8-f266-4422-baa3-1900831a2e06",
            TipoReferenciaId: 5,
            Criterio: data.NombreCriterio,
            TipoCriterio: 1,
            Operador: 3,
            Diferido: false,
            MetodoNombre: "GetRutaByGestionId",
            Campos: [
              {
                NombreCampo: "GestionId",
                Fixed: true,
                Orden: 1,
              },
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
        })}>
        <Row>
          <Col>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Nombre Encabezado</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nombre"
                {...register("NombreEncabezado", { required: true })}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Nombre Solicitud hr</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nombre"
                {...register("NombreSolicitudHr", { required: true })}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Nombre Solicitud ar</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nombre"
                {...register("NombreSolicitudAr", { required: true })}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
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
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>
                ¿Desea añadir los parámetros a los tipos de solicitud?
              </Form.Label>
              <div>
                <Form.Check
                  type="radio"
                  label="Sí"
                  value="si"
                  onClick={() => setparametros(true)}
                  {...register("OpcionActivada", { required: true })}
                  id="opcion-si"
                  name="OpcionActivada"
                />
                <Form.Check
                  type="radio"
                  label="No"
                  onClick={() => setparametros(false)}
                  value="no"
                  {...register("OpcionActivada", { required: true })}
                  id="opcion-no"
                  name="OpcionActivada"
                />
              </div>
            </Form.Group>
          </Col>
          {parametros && (
            <Row>
              <Col>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1">
                  <Form.Label>Nombre Parámetro</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nombre"
                    {...register("NombreParametro", { required: true })}
                  />
                </Form.Group>
              </Col>
            </Row>
          )}
        </Row>
        <Row>
          <Col>
            <Button className="w-100" variant="success" type="submit">
              Crear
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}

export default Hr;
