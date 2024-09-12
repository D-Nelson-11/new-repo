import React from "react";
import Cardss from "../components/Cardss";
import { Container } from "react-bootstrap";
import Esquemas from './Esquemas/Esquemas'
import Cronometro from './Cronometro/Cronometro'
import Eventos from "./Eventos/Eventos";
import Rotuladores from "./Esquemas/Rotuladores";

function Index() {
  return (
    <Container className="mt-5 d-flex">
      <Cardss subModulo={"Esquemas"} Contenido={<Esquemas/>} Nombre="Crear" />
      <Cardss subModulo={"Cronometro"} Contenido={<Cronometro/>} Nombre="Crear" />
      {/* <Cardss subModulo={"Rotuladores"} Contenido={<Rotuladores/>} Nombre="Crear" /> */}
      {/* <Cardss subModulo={"Eventos"} Contenido={<Eventos/>} Nombre="Crear" /> */}
    </Container>
  );
}

export default Index;
