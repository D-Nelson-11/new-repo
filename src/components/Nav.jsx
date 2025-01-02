import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Outlet } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useState } from "react";

function BarraNavegacion() {
  const [lgShow, setLgShow] = useState(false);
  const { handleSubmit, register } = useForm();
  const [textArea, setTextArea] = useState("");

  const handleTextAreaChange = (event) => {
    setTextArea(event.target.value);
  };
  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          {/* <Navbar.Brand href="#home">Navbar</Navbar.Brand> */}
          <Nav className="me-auto">
            <Nav.Link href="/new-repository/#/AnalisisDeRed">Analisis de red</Nav.Link>
            <Nav.Link href="/new-repository/#/Intransit">Intransit</Nav.Link>
            <Nav.Link href="/new-repository/#/Matriz">Matriz</Nav.Link>
            <Nav.Link href="/new-repository/#/Sku">Skus</Nav.Link>
            <Nav.Link href="/new-repository/#/Personas">Sitios</Nav.Link>

          </Nav>
        </Container>
      </Navbar>
      <Outlet />
    </>
  );
}

export default BarraNavegacion;

