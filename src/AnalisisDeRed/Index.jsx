import Cardss from "../components/Cardss";
import { Container } from "react-bootstrap";
import Esquemas from './Esquemas/Esquemas'
import Hr from "./HrSo/Hr";
import So from "./HrSo/So";
import Sa from "./HrSo/Sa";
import Cronometro from "./Cronometro/Cronometro";

function Index() {
  return (
    <Container className="mt-5 d-flex">
      <Cardss subModulo={"Esquemas"} Contenido={<Esquemas/>} Nombre="Crear" />
      {/* <Cardss subModulo={"Crear Rutas"} Contenido={<PruebaRutas/>} Nombre="Crear" /> */}
      <Cardss subModulo={"Crear HR"} Contenido={<Hr/>} Nombre="Crear" />
      <Cardss subModulo={"Crear SO"} Contenido={<So/>} Nombre="Crear" />
      <Cardss subModulo={"Crear SA"} Contenido={<Sa/>} Nombre="Crear" />
      {/* <Cardss subModulo={"Cronometro"} Contenido={<Cronometro/>} Nombre="Crear" /> */}


      {/* <Cardss subModulo={"Crear Rutas 2"} Contenido={<CrearRutas/>} Nombre="Crear" /> */}
      {/* <Cardss subModulo={"Rotuladores"} Contenido={<Rotuladores/>} Nombre="Crear" /> */}
      {/* <Cardss subModulo={"Eventos"} Contenido={<Eventos/>} Nombre="Crear" /> */}
    </Container>
  );
}

export default Index;
