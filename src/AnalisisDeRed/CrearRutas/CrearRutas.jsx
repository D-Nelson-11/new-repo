import React from "react";
import { get, set, useForm } from "react-hook-form";
import { Col, Row, Form, Button, Container } from "react-bootstrap";
import { useState } from "react";
import { SitiosRutaMadre } from "./Compuesta";
import { RutaSimple } from "./Simple";

 export const clientes = [
    {
      id: "1194ba34-fcb6-433d-863a-0f25da9a6522",
      nombre: "CARGILL DE HONDURAS",
    },
    { id: "65507ECF-249E-454B-A95A-0061BA0FA2BA", nombre: "VESTA TRADING" },
    {
      id: "B6BCFD11-E191-4C92-9E31-0F296273235E",
      nombre: "AZUCARERA DEL NORTE S.A. DE C.V.",
    },
    {
      id: "520E3857-D535-4BA0-B0A6-23E7DA34F0A6",
      nombre: "MAGNO CARTONES Y EMPAQUES S. DE R.L.",
    },
    {
      id: "CF884F18-6C35-4703-A48B-21FD0680B2CE",
      nombre: "DINANT EXPORTS SA DE CV",
    },
    {
      id: "B49E29B0-F0CD-4ED2-B0C4-21A2D59925A8",
      nombre: "SOUTHERN APPAREL CONTRACTORS, S.A",
    },
    {
      id: "9247ff77-772b-460c-9a6d-1356e3675560",
      nombre: "LOGÍSTICA INTEGRAL HONDUREÑA S.A. DE C.V.",
    },
    {
      id: "71A408DE-F4C1-489D-B2EE-0F27FC48133B",
      nombre: "EXPORTADORA DEL ATLANTICO SA DE CV",
    },
    {
      id: "EB4C57BB-672E-40BC-858A-1719B7224A88",
      nombre: "STANDARD FRUIT DE HONDURAS S.A.",
    },
    {
      id: "6F15E370-6C5B-4A12-9E92-12DEB27C8DAB",
      nombre: "EMPACADORA PERRY Y COMPAÑÍA LIMITAD",
    },
    {
      id: "0943F378-CD71-4567-9DA7-12DEAF62B1E3",
      nombre: "AGRIBRANDS PURINA DE GUATEMALA,S.A.",
    },
    {
      id: "8092E57D-03A5-44D3-B271-0F27EBF3D818",
      nombre: "CORPORACION DINANT SA DE CV",
    },
    {
      id: "691A8DEC-F8F9-4055-A405-24B2EB1B6BB2",
      nombre: "ALSA CONSOLIDADORES S.A",
    },
    {
      id: "BF036D39-5FBD-4CC3-934D-138B20F8D4D1",
      nombre: "PROMODA DE HONDURAS SA",
    },
    {
      id: "E9CB3A00-6EF1-41F9-A3DE-138B2016972B",
      nombre: "JOVENMODA DE HONDURAS SA",
    },
    {
      id: "E747939F-542D-4514-B3BC-138B1FDD8349",
      nombre: "ESPATIENDAS DE HONDURAS SA",
    },
    {
      id: "27276913-746D-4188-B747-138B2093C5A3",
      nombre: "INTERTIENDAS DE HONDURAS SA",
    },
    {
      id: "EBF43773-E4A0-4357-897E-149A81C84AAA",
      nombre: "CARGILL DE NICARAGUA",
    },
    {
      id: "042E6402-7EFB-4415-962B-2707B4AA5BF2",
      nombre: "CORPORACION PIPASA, S.R.L",
    },
      {
      id: "11633EC3-0487-4D15-B384-0F27F8CFF578",
      nombre: "UNO HONDURAS S.A. DE C.V.",
    },
      {
      id: "4A84BBCC-5A43-400A-AC17-0F27ED3BA39C",
      nombre: "EMBOTELLADORA LA REYNA S.A DE C.V.",
    }, {
      id: "9136ACD5-D43F-49E4-82FD-1DEA3C8C5A0B",
      nombre: "LIVSMART AMERICAS, S.A. DE C.V.",
    },
    {
      id: "A5070E56-D359-4FF1-A4AE-0F27F4532303",
      nombre: "COMPAÑIA INDUST LIDO-POZUELO SA CV",
    },
     {
      id: "91EF67A2-4F50-44EE-B0E5-0F27E8DFB778",
      nombre: "CERVECERIA HONDUREÑA SA DE CV",
    },
     {
      id: "834FC5F9-AB8C-4BCA-9270-1693145FB27D",
      nombre: "INDUSTRIA SULA S. DE RL.",
    },
      {
      id: "D259B0C9-5203-4F33-81C2-0F27EA263D9E",
      nombre: "INDUSTRIA FARMACEUTICA",
    },
      {
      id: "436FCD5E-C720-4FFA-846E-24CF3A7C9AE2",
      nombre: "ACAVISA HN",
    },
      {
      id: "5B6B3C65-B006-4AE2-904D-1BFF7FFEF846",
      nombre: "ACI DEPOT S DE RL",
    },
     {
      id: "32575917-7F9E-4712-832F-0F29BC82BA3D",
      nombre: "MAERSK HONDURAS S.A.",
    },
  ];

function CrearRutas() {
  const form1 = useForm();
  let [tipoRuta, setTipoRuta] = useState("");
  let [sitios, setSitios] = useState(false);

  return (
    <Container className="w-100 mt-2" fluid>
      <Form className="d-flex flex-wrap">
        <div className="mb-3 col-2 h-75">
          <Form.Select {...form1.register("IdCliente", { required: true })}>
            <option value="">--Seleccione Cliente--</option>
            {clientes
              .sort((a, b) => a.nombre.localeCompare(b.nombre))
              .map((cliente) => (
                <option key={cliente.id} value={[cliente.id, cliente.nombre]}>
                  {cliente.nombre}
                </option>
              ))}
          </Form.Select>
        </div>
        <div className="mb-3 col-1 h-75">
          <Form.Select onChange={(e) => {
            setSitios(false);
            setTipoRuta(e.target.value)}}>
            <option value="">Tipo Ruta</option>
            <option value="compuesta">Compuesta</option>
            <option value="simple">Simple</option>
          </Form.Select>
        </div>
        {tipoRuta === "compuesta" && (
          <div className="d-flex flex-wrap col-6 ms-1">
            <label className="align-content-center"># sitios Madre:</label>
            <Form.Control
              type="number"
              {...form1.register("cantSitiosMadre", { required: true })}
              placeholder="Ej:4,5,6"
              style={{ width: "25%" }}
              className="h-75"
            />
            <label className="align-content-center"># sitios Hija:</label>
            <Form.Control
              type="number"
              {...form1.register("cantSitiosHija", { required: true })}
              placeholder="Ej: 1,2,3"
              style={{ width: "25%" }}
              className="h-75"
            />
          </div>
        )}
        {tipoRuta === "simple" && (
          <div className="d-flex flex-wrap col-2 justify-content-between">
            <label htmlFor=""># sitios:</label>
            <Form.Control
              type="number"
              {...form1.register("cantSitiosSimple", { required: true })}
              placeholder="Ej: 1,2,3"
              style={{ width: "60%" }}
              className="h-75"
            />
          </div>
        )}
        <div className="d-flex flex-wrap col-2">
          <Button
            onClick={() => {
              if (form1.getValues("IdCliente") === "") {
                alert("Seleccione un cliente");
                return;
              }
              setSitios(true);
            }}
            variant="success"
            className="w-100 ms-1 h-75"
            disabled={tipoRuta === "" ? true : false}>
            Comenzar
          </Button>
        </div>
      </Form>
      {sitios && tipoRuta === "compuesta" && (
        <>
          <SitiosRutaMadre
            cantidad={form1.getValues("cantSitiosMadre")}
            IdCliente={form1.getValues("IdCliente")}
            cantidadHija={form1.getValues("cantSitiosHija")}
          />
          {/* <SitiosRutaHija cantidad={form1.getValues("cantSitiosHija")} IdCliente={form1.getValues("IdCliente")}/> */}
        </>
      )}

      {sitios && tipoRuta === "simple" && (
        <>
          <RutaSimple
            cantidad={form1.getValues("cantSitiosSimple")}
            IdCliente={form1.getValues("IdCliente")}
          />
        </>
      )}
    </Container>
  );
}

export default CrearRutas;
