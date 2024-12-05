import React from "react";
import Cardss from "../components/Cardss";
import { Container } from "react-bootstrap";
import Esquemas from './Esquemas/Esquemas'
import PruebaRutas from "../PruebaRutas/PruebaRutas";

function Index() {
  return (
    <Container className="mt-5 d-flex">
      <Cardss subModulo={"Esquemas"} Contenido={<Esquemas/>} Nombre="Crear" />
      <Cardss subModulo={"Crear Rutas"} Contenido={<PruebaRutas/>} Nombre="Crear" />
      {/* <Cardss subModulo={"Rotuladores"} Contenido={<Rotuladores/>} Nombre="Crear" /> */}
      {/* <Cardss subModulo={"Eventos"} Contenido={<Eventos/>} Nombre="Crear" /> */}
    </Container>
  );
}

export default Index;
