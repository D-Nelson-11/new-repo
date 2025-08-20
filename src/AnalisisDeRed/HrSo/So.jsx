import { useForm } from "react-hook-form";
import { Form, Col, Row, Container, Button } from "react-bootstrap";
import axios from "../../api/axios";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { parametrosSO } from "./parametros";

function So() {
  const { register, handleSubmit } = useForm();
  let [parametros, setparametros] = useState(false);

  return (
    <Container fluid className="mt-3">
      <Form
        onSubmit={handleSubmit(async (data) => {
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
            TipoSolicitudes: [
              {
                Id: resp1.data.Id,
                Orden: 1,
              },
            ],
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

          if (parametros) {
            for (let i = 0; i < parametrosSO.length; i++) {
              if (i == data.Aduana) {
                let json = {
                  TipoSolicitudId: resp1.data.Id,
                  ParametrosId: parametrosSO[i],
                  CreatedBy: "0C3A7B92-34D7-453A-883F-24C15B24FF6A",
                };
                console.log("JSON",JSON.stringify(json));
                const respParametros = await axios.post('https://analisisderedapi.vesta-accelerate.com/api/TipoSolicitudParametroCrudApi/CreateWithMuchosParametrosId', JSON.stringify(json));
                toast.success(respParametros.data.Message); 
              }
            }
          }
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
        </Row>
        <Row>
          <Col>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Nombre Solicitud SO</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nombre"
                {...register("NombreSolicitudSo", { required: true })}
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
                ¿Añadir los parámetros al tipo de solicitud?
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
                  <Form.Label>Aduana</Form.Label>
                  <Form.Select {...register("Aduana", { required: true })}>
                    <option value="">--Seleccione--</option>
                    <option value="0">Puerto Cortés</option>
                    <option value="1">La Mesa</option>
                    <option value="2">Las manos</option>
                    <option value="3">El Florido</option>
                    <option value="4">Guasaule</option>
                    <option value="5">Amatillo</option>
                    <option value="6">Corinto</option>
                    <option value="7">Toncontín</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Nombre del componente</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="ej: DUCA-D/IMPORT/LA MESA/AZN"
                    {...register("NombreComponente", { required: true })}
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

export default So;
