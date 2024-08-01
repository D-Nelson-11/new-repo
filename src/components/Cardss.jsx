import Card from "react-bootstrap/Card";
import ModalC from "./ModalC";



function Cardss({ subModulo, Contenido, Nombre }) {
  return (
    <Card style={{ width: "18rem", marginRight:"10px" }}>
      <Card.Body>
        <Card.Title>{subModulo}</Card.Title>
        <ModalC ContenidoModal={Contenido} Nombre ={Nombre}/>
      </Card.Body>
    </Card>
  );
}

export default Cardss;
