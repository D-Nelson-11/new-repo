import React from "react";
import Cardss from "../components/Cardss";
import { Container } from "react-bootstrap";
import SitioCliente from "./Sitios/SitioCliente";

function Index() {
  return (
    <Container className="mt-5 d-flex">
      <Cardss subModulo={"Sitio Cliente Vesta"} Contenido={<SitioCliente/>} Nombre="Crear" />
    </Container>
  );
}

export default Index;
