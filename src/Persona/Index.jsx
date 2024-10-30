import React from "react";
import Cardss from "../components/Cardss";
import { Container } from "react-bootstrap";
import SitioCliente from "./Sitios/SitioCliente";
import SitioAnalisis from "./Sitios/SitiosAR";

function Index() {
  return (
    <Container className="mt-5 d-flex">
      <Cardss subModulo={"Sitio Personas"} Contenido={<SitioCliente/>} Nombre="Crear" />
      <Cardss subModulo={"Sitio Aanalisis de Red"} Contenido={<SitioAnalisis/>} Nombre="Crear" />

    </Container>
  );
}

export default Index;
