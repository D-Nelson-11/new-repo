import React from "react";
import { useForm } from "react-hook-form";
import { Form, Button, Container } from "react-bootstrap";
import { useState } from "react";
import { SitiosRutaMadre } from "./Compuesta";
import { RutaSimple } from "./Simple";
import { colors } from "../../theme/colors";
import ClientesSelect from "../../components/ClientesSelect";


  function CrearRutas() {
  const form1 = useForm();
  let [tipoRuta, setTipoRuta] = useState("");
  let [sitios, setSitios] = useState(false);

  return (
    <Container className="w-100 mt-2" fluid>
      <Form className="d-flex flex-wrap">
        <div className="mb-3 col-2 h-75">
          {/* <Form.Select {...form1.register("IdCliente", { required: true })}>
            <option value="">--Seleccione Cliente--</option>
            {clientes
              .sort((a, b) => a.nombre.localeCompare(b.nombre))
              .map((cliente) => (
                <option key={cliente.id} value={[cliente.id, cliente.nombre]}>
                  {cliente.nombre}
                </option>
              ))}
          </Form.Select> */}
                      <ClientesSelect register={form1.register} />
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
            style={{ backgroundColor: colors.colorAzulGeneral, border: "none"}}
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
