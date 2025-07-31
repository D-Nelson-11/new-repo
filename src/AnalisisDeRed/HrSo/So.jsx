import { useForm } from "react-hook-form";
import { Form, Col, Row, Container, Button } from "react-bootstrap";
import axios from "../../api/axios";
import { useState, useEffect } from "react";

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

          // // CREAR SOLICITUD AR
          // let json2 = {
          //   Nombre: data.NombreSolicitudAr,
          //   CreatedBy: "0C3A7B92-34D7-453A-883F-24C15B24FF6A",
          //   SistemaId: "62B010A8-F266-4422-BAA3-1900831A2E06",
          //   MetodoNombre: "AsignarReferenciaOperativaHojaRutaAGestion",
          //   EsDiferido: false,
          // };
          // const resp2 = await axios.post(
          //   "https://analisisderedapi.vesta-accelerate.com/api/TipoSolicitudCrudApi/Create",
          //   json2
          // );
          // console.log('tipoSolicitudAr: ' + resp2.data);

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
                  <Form.Label>Centro Suministrador</Form.Label>
                  <Form.Select
                    {...register("centroSuministrador", { required: true })}>
                    <option value="">--Seleccione--</option>
                        <option value="D9A26B1F-637F-4E10-8CF8-1B826471AB4F">9520</option>
                  <option value="3B5CC2C2-BA24-420C-848D-1C05716F67FC">9560</option>
                  <option value="D81C464C-F3D1-46AC-957D-1C1478ECDED7">9566</option>
                  <option value="B064EE4A-5F79-44D5-BAEC-1C1532F4C1CF">9515</option>
                  <option value="EE9A3801-3FEF-4073-9A7E-1D948624501B">9535</option>
                  <option value="A12248A5-5ED2-43C4-B0AB-1D94F4C42C94">9540</option>
                  <option value="DB42CFB2-A0A2-4711-B8A6-1F771FCC2A5A">9545</option>
                  <option value="E26E133A-CE61-424B-BDDE-1F901A5C7998">9565</option>
                  <option value="3B02A1F7-875B-4C5A-82D6-1FBA80C07F01">9510</option>
                  <option value="349D0C4D-4913-456B-A80E-2079C3BD5764">9525</option>
                  <option value="771E9E40-2FB7-4CEE-9375-2079DF6A09C1">9555</option>
                  <option value="741BB77A-F0EE-48CF-8FC4-25524A17747B">9556</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1">
                  <Form.Label>Oficina Venta</Form.Label>
                  <Form.Select
                    {...register("oficinaVenta", { required: true })}>
                    <option value="">--Seleccione--</option>
                     <option value="1FD0137E-24F5-489C-A17A-1B8262E64F2C">9520</option>
                <option value="22D3A701-50C5-43BE-84ED-1C0570170E93">9560</option>
                <option value="A59D010F-1B0E-406F-BD1D-1C1478AFD1D6">9566</option>
                <option value="DB041D24-05CB-4ABC-9FF0-1C1532AAA8D7">9515</option>
                <option value="2F37FBF9-3DA6-481A-A252-1D9485C188F0">9535</option>
                <option value="9684B11A-0979-4EFD-88DA-1D94F4812B7B">9540</option>
                <option value="9FA787ED-F7AA-4FDC-8FF8-1F771F83E44B">9545</option>
                <option value="DC2B456B-B3A2-4BC0-84D2-1F901938DDC4">9565</option>
                <option value="EBA934B1-1FDE-4ED5-A746-1FBA7F8A03E7">9510</option>
                <option value="60F05CF1-49F1-49DA-B5AA-2065A79A6815">9595</option>
                <option value="4C50EB01-1B13-437A-A3BE-2079C355ACB4">9525</option>
                <option value="3B9CA2FF-A522-4D66-BCCE-2079DEA4E53B">9555</option>
                <option value="89FA8298-65E2-44BB-AD90-25524A730BD6">9556</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1">
                  <Form.Label>Canal</Form.Label>
                  <Form.Select {...register("Canal", { required: true })}>
                    <option value="">--Seleccione--</option>
            <option value="D2BB9C3C-A62C-4D90-AC20-1B8262880C28">95</option>
            <option value="B923303C-AF85-4061-AE4B-1C1527F330E3">D2</option>
            <option value="781A10C4-7FDE-4407-866F-1C49D4A68273">D3</option>
            <option value="A546BC6D-5910-48C9-BB71-1E8564B41476">96</option>
            <option value="22FA4C31-F08F-4631-94A7-1ECC1BDAD901">C1</option>
            <option value="7C6E0B60-F83E-45A0-8203-1ECC1BFE55A9">C2</option>
            <option value="3FE4C1D5-F88A-4187-A696-1ECC1C17BCC5">C3</option>
            <option value="3FEC9D1F-3ED9-4ACE-99A5-1F3053B57508">S1</option>
            <option value="459C73E1-A36A-462A-8525-1F90183B761C">95</option>
            <option value="6AA70346-5D66-4892-8EE1-2079B63008B0">C1</option>
            <option value="138D52D7-9EB5-4D51-B3C3-2079B669ADF5">C2</option>
            <option value="1CF2487F-D0EC-467C-86E3-2079B6AE179A">C3</option>
            <option value="4B11F446-5049-45A5-AFB4-20AEFA26BACB">N1</option>
            <option value="7BB2500F-1048-46E9-9B6E-21849B4727ED">D4</option>
            <option value="E47D9AD3-A73E-487D-808A-2184CF8E935B">G1</option>
            <option value="83F53559-15BD-4324-9241-2315E71854DA">R1</option>
            <option value="FC4B3FE4-F771-473B-AE1F-238388323647">C4</option>
            <option value="D060600B-80B0-477A-B09D-2383886425B6">C5</option>
            <option value="D52D1E05-B1F7-48B8-B492-23838899730B">C8</option>
            <option value="C3A7C750-1976-44AD-9E98-23C2F3D7AF1F">96</option>
            <option value="56244CC8-3469-4EAE-87A3-255BE007C77A">91</option>
            <option value="744F9338-DB67-444A-BB0B-267AF8CE335F">21</option>
            <option value="E5C798F4-7C81-4D9D-A727-26892140CCD8">97</option>
            <option value="9F854BAA-3F52-40AF-A59E-2689270DA1CC">24</option>
                  </Form.Select>
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
