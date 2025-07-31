import React from "react";
import { useEffect, useState } from "react";
import axios from '../api/axios'
import { Form } from "react-bootstrap";
function ClientesSelect({ register }) {
  const [clientes, setClientes] = useState([]);
  useEffect(() => {
    async function ObtenerDatos() {
        try {
        const resp2 = await axios.get(
          "https://personasapi.vesta-accelerate.com/api/PersonaClienteServiceApi/GetAllClientes"
        );
        console.log(resp2)
        setClientes(
          resp2.data
            .map((cliente) => ({
              Id: cliente.Id,
              Nombre: cliente.Nombre,
            }))
            .sort((a, b) => a.Nombre.localeCompare(b.Nombre)) // Ordenar alfabéticamente
        );
      } catch (error) {
        console.error(error);
      } finally {
      }
    }

    ObtenerDatos();
  }, []);

  return (
    <Form.Select {...register("IdCliente")}>
      {clientes.map((cliente) => (
        <option key={cliente.Id} value={[cliente.Id, cliente.Nombre]}>
          {cliente.Nombre}
        </option>
      ))}
    </Form.Select>
  );
}

export default ClientesSelect;
