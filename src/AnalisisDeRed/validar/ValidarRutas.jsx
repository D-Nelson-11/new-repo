// import { clientes } from "../CrearRutas/CrearRutas";
import { Container, Form } from "react-bootstrap";
import Tabla from "../../components/Tabla";
import axios from "../../api/axios";
import { useState } from "react";

function ValidarRutas() {
  const [clienteId, setClienteId] = useState("");
  const [data, setData] = useState([]);
  return (
    <Container className="mt-2" fluid>
      <Form>
        {/* <div className="mb-3 col-2 h-75">
          <Form.Select
            onChange={async (e) => {
              setClienteId(e.target.value);
              const response = await axios.post(
                `https://analisisderedapi.vesta-accelerate.com/api/RutaCrudApi/Index`,
                { ClienteId: e.target.value }
              );
              console.log(response.data);
              setData(response.data.Message);
            }}>
            <option value="">--Seleccione Cliente--</option>
            {clientes
              .sort((a, b) => a.nombre.localeCompare(b.nombre))
              .map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nombre}
                </option>
              ))}
          </Form.Select>
        </div> */}
      </Form>

      {clienteId === "" ? (
        <p className="text-danger">Seleccione un cliente</p>
      ) : (
        <Tabla data={data} />
      )}
    </Container>
  );
}

export default ValidarRutas;
