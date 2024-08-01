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
            <Nav.Link href="/new-repo/Personas">Personas</Nav.Link>
            <Nav.Link href="/new-repo/AnalisisDeRed">Analisis de red</Nav.Link>
            <Nav.Link href="">CFO</Nav.Link>
            <Nav.Link onClick={() => setLgShow(true)}>Ajustar Textos</Nav.Link>
          </Nav>

          <Modal
            size="lg"
            show={lgShow}
            onHide={() => setLgShow(false)}
            aria-labelledby="example-modal-sizes-title-lg">
            <Modal.Header closeButton />
            <Modal.Body
              className="d-flex justify-content-between"
              style={{ height: "400px" }}>
              <div className="w-50 m-1">
                <Form
                  className="h-100"
                  onSubmit={handleSubmit((values) => {
                    let array = values.cadena.split(" ");
                    let perro = array.map((element, i) => {
                      if (i == array.length - 1) {
                        return (element = `'${element}'`);
                      }
                      return (element = `'${element}',`);
                    });
                    let stringArreglado = "";

                    for (let i = 0; i < perro.length; i++) {
                      stringArreglado += perro[i];
                    }
                    setTextArea(stringArreglado);
                  })}>
                  <textarea
                    name=""
                    style={{ width: "100%", height: "90%" }}
                    {...register("cadena", { required: true })}></textarea>
                  <Button className="w-100" variant="success" type="submit">
                    Generar
                  </Button>
                </Form>
              </div>
              <div className="w-50 m-1">
                <textarea
                  style={{ width: "100%", height: "90%" }}
                  value={textArea}
                  onChange={handleTextAreaChange}></textarea>
              </div>
            </Modal.Body>
          </Modal>
        </Container>
      </Navbar>
      <Outlet />
    </>
  );
}

export default BarraNavegacion;

