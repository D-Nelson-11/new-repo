import React from "react";
import Cardss from "../components/Cardss";
import { Container } from "react-bootstrap";
import Componentes from "./Componentes";

function Index() {
  return (
    <Container className="mt-5 d-flex" fluid={true}> 
        <Componentes/>
    </Container>
  );
}

export default Index;
