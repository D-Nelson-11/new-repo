import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Outlet } from "react-router-dom";
import image from '../public/image.png'; // Adjust the path as necessary
import { colors } from "../theme/colors";

function BarraNavegacion() {
  return (
    <>
      <Navbar style={{ backgroundColor: colors.colorAzulGeneral }} data-bs-theme="dark">
        <Navbar.Brand href="/new-repo/#/AnalisisDeRed" className="text-white">
          <img src={image} alt="Logo" style={{ height: "30px" }} />
        </Navbar.Brand>
        <Container>
          {/* <Navbar.Brand href="#home">Navbar</Navbar.Brand> */}
          <Nav className="me-auto">
            <Nav.Link href="/new-repo/#/AnalisisDeRed">Analisis de red</Nav.Link>
            <Nav.Link href="/new-repo/#/Intransit">Intransit</Nav.Link>
            <Nav.Link href="/new-repo/#/Cronometros">Cronómetros</Nav.Link>
            <Nav.Link href="/new-repo/#/Sku">Skus</Nav.Link>
            {/* <Nav.Link href="/new-repo/#/Personas">Sitios</Nav.Link> */}
            <Nav.Link href="/new-repo/#/Rutas">Rutas</Nav.Link>
            {/* <Nav.Link href="/new-repo/#/Prueba">Prueba</Nav.Link> */}
            {/* <Nav.Link href="/new-repo/#/Cfo">Cfo</Nav.Link> */}
            {/* <Nav.Link href="/new-repo/#/validarR">Validar</Nav.Link> */}

          </Nav>
        </Container>
      </Navbar>
      <Outlet />
    </>
  );
}

export default BarraNavegacion;

