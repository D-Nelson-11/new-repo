import React from "react";
import { get, set, useForm } from "react-hook-form";
import { Col, Row, Form, Button, Container } from "react-bootstrap";
import { useState } from "react";
import { SitiosRutaMadre } from "./Sitios";
import { RutaSimple } from "./Simple";

function CrearRutas() {
  const form1 = useForm();
  let [tipoRuta, setTipoRuta] = useState("");
  let [sitios, setSitios] = useState(false);

  return (
    <Container className="w-100 mt-2" fluid>
      <Form className="d-flex flex-wrap">
        <div className="mb-3 col-2 h-75">
          <Form.Select
            onChange={() => set}
            {...form1.register("IdCliente", { required: true })}>
            <option value="">--Seleccione Cliente--</option>
            <option
              value={[
                "1194ba34-fcb6-433d-863a-0f25da9a6522",
                "CARGILL DE HONDURAS",
              ]}>
              Cargill de Honduras
            </option>
            <option
              value={["65507ECF-249E-454B-A95A-0061BA0FA2BA", "VESTA TRADING"]}>
              Vesta Trading
            </option>
            <option
              value={[
                "B6BCFD11-E191-4C92-9E31-0F296273235E",
                "AZUCARERA DEL NORTE S.A. DE C.V.",
              ]}>
              Azunosa
            </option>
            <option
              value={[
                "520E3857-D535-4BA0-B0A6-23E7DA34F0A6",
                "MAGNO CARTONES Y EMPAQUES S. DE R.L.",
              ]}>
              Magno Cartones y Empaques
            </option>
            <option
              value={[
                "CF884F18-6C35-4703-A48B-21FD0680B2CE",
                "DINANT EXPORTS SA DE CV",
              ]}>
              Dinant Exports
            </option>
          </Form.Select>
        </div>
        <div className="mb-3 col-1 h-75">
          <Form.Select onChange={(e) => setTipoRuta(e.target.value)}>
            <option value="">Tipo Ruta</option>
            <option value="compuesta">Compuesta</option>
            <option value="simple">Simple</option>
          </Form.Select>
        </div>
        {tipoRuta === "compuesta" && (
          <div className="d-flex flex-wrap col-3 justify-content-between ms-1">
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
