import React from "react";
import Cardss from "../components/Cardss";
import { Container } from "react-bootstrap";
import Sku from "./SKU/Sku";

function Index() {
  return (
    <Container className="mt-5 d-flex">
      <Cardss subModulo={"SKU"} Contenido={<Sku/>} Nombre="Crear" />
    </Container>
  );
}

export default Index;
