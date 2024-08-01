import React from "react";
import { useForm } from "react-hook-form";
import { Form, Button } from "react-bootstrap";
import { useState } from "react";
import jsonAmatillo from "./JSON/amatillo.json";
import jsonPtoCortes from "./JSON/PuertoCortes.json";
import jsonLaMesa from "./JSON/LaMesa.json";
import jsonElPoy from "./JSON/ElPoy.json";

function Esquemas() {
  const { handleSubmit, register, setValue } = useForm();
  const [EsquemaAmatillo, setEsquemaAmatillo] = useState(jsonAmatillo);
  const [EsquemaCortes, setEsquemaCortes] = useState(jsonPtoCortes);
  const [EsquemaLaMesa, setEsquemaLaMesa] = useState(jsonLaMesa);
  const [EsquemaElPoy, setEsquemaElPoy] = useState(jsonElPoy);

  const [textAreaValue, setTextAreaValue] = useState("");

  const onSubmit = (values) => {
    if (values.esquemaNombre == 1) {
      const updatedEsquemaAmatillo = { ...EsquemaAmatillo };
      updatedEsquemaAmatillo.Esquemas.forEach((esquema) => {
        esquema.ClienteId = values.ClienteId;
        esquema.SitioPorRutaId = values.SitioXRuta;
        esquema.ClienteNombre = values.NombreCliente;
        esquema.UsuarioId = values.IdUsuario;

      });

      setEsquemaAmatillo(updatedEsquemaAmatillo);
      setTextAreaValue(JSON.stringify(updatedEsquemaAmatillo, null, 2));
    } else if (values.esquemaNombre == 3) {
      const updatedEsquemaCortes = { ...EsquemaCortes };
      updatedEsquemaCortes.Esquemas.forEach((esquema) => {
        esquema.ClienteId = values.ClienteId;
        esquema.SitioPorRutaId = values.SitioXRuta;
        esquema.ClienteNombre = values.NombreCliente;
        esquema.UsuarioId = values.IdUsuario;
      });

      setEsquemaCortes(updatedEsquemaCortes);
      setTextAreaValue(JSON.stringify(updatedEsquemaCortes, null, 2));
    } else if (values.esquemaNombre == 4) {
      const updatedEsquemaLaMesa = { ...EsquemaLaMesa };
      updatedEsquemaLaMesa.Esquemas.forEach((esquema) => {
        esquema.ClienteId = values.ClienteId;
        esquema.SitioPorRutaId = values.SitioXRuta;
        esquema.ClienteNombre = values.NombreCliente;
        esquema.UsuarioId = values.IdUsuario;
      });

      setEsquemaCortes(updatedEsquemaLaMesa);
      setTextAreaValue(JSON.stringify(updatedEsquemaLaMesa, null, 2));
    } else if (values.esquemaNombre == 5) {
      const updatedEsquemaElPoy = { ...EsquemaElPoy };
      updatedEsquemaElPoy.Esquemas.forEach((esquema) => {
        esquema.ClienteId = values.ClienteId;
        esquema.SitioPorRutaId = values.SitioXRuta;
        esquema.ClienteNombre = values.NombreCliente;
        esquema.UsuarioId = values.IdUsuario;
      });

      setEsquemaCortes(updatedEsquemaElPoy);
      setTextAreaValue(JSON.stringify(updatedEsquemaElPoy, null, 2));
    }
  };

  return (
    <div className="d-flex w-100 justify-content-between">
      <div style={{ width: "33%" }}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Esquema</Form.Label>
            <Form.Select
              aria-label="Default select example"
              {...register("esquemaNombre", { required: true })}>
              <option value=""></option>
              <option value="1">
                El Florido/Amatillo/Las Manos/Corinto/Agua Caliente
              </option>
              <option value="2">Puerto Castilla</option>
              <option value="3">Puerto Cortés</option>
              <option value="4">La Mesa</option>
              <option value="5">El Poy</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Sitio Por Ruta</Form.Label>
            <Form.Control
              type="text"
              placeholder=""
              {...register("SitioXRuta", { required: true })}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>ClienteId</Form.Label>
            <Form.Control
              type="text"
              placeholder=""
              {...register("ClienteId", { required: true })}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Nombre Cliente</Form.Label>
            <Form.Control
              type="text"
              placeholder=""
              {...register("NombreCliente", { required: true })}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Usuario</Form.Label>
            <Form.Select {...register("IdUsuario", { required: true })}>
              <option value="0C3A7B92-34D7-453A-883F-24C15B24FF6A">
                David
              </option>
              <option value="FF921408-E3B9-469B-A7DC-24A2B8D3C4F5">Joel</option>
            </Form.Select>
          </Form.Group>
          <Button type="submit" className="w-100">
            Generar
          </Button>
        </Form>
      </div>

      <div style={{ width: "65%" }}>
        <textarea
          value={textAreaValue}
          style={{ width: "100%", height: "100%" }}></textarea>
      </div>
    </div>
  );
}

export default Esquemas;
