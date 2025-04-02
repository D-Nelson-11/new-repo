import React from "react";
import Cardss from "../components/Cardss";
import { Container } from "react-bootstrap";
import Sku from "./Sku";
import SkuEmbalajes from "./SkuEmbalajes";

function IndexSku() {
  return (
    <Container className="mt-5 d-flex">
      <Cardss subModulo={"Sku-Inbound"} Contenido={<Sku/>} Nombre="Crear" />
      <Cardss subModulo={"Sku-Embalajes"} Contenido={<SkuEmbalajes/>} Nombre="Crear" />
    </Container>
  );
}

export default IndexSku;
