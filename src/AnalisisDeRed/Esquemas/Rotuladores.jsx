import React from "react";
import { useForm } from "react-hook-form";
import { Form, Button } from "react-bootstrap";
import { useState } from "react";

function Rotuladores() {
  const { handleSubmit, register, setValue } = useForm();
  const [opcionRotuladores, setOpcionRotuladores] = useState([]);

  const handleChange = (e) => {
    const value = e.target.value;
    if (value === "1") {
      setOpcionRotuladores([
        "Revisión",
        "Liberación Post Revisión",
        {
          EsquemaId: "string",
          Rotuladores: ["string"],
          UsuarioId: "string",
        },
        {
          EsquemaId: "string",
          Rotuladores: ["string"],
          UsuarioId: "string",
        },
      ]);
    } else if (value === "3") {
      setOpcionRotuladores(["Inspeccion", "Despacho"]);
    } else if (value === "4") {
      setOpcionRotuladores(["Revisión", "Liberación Post Revisión"]);
    }
    // Update the form value
    setValue("esquemaNombre", value);
  };

  return (
    <div className="d-flex w-100 justify-content-between">
      <div style={{ width: "33%" }}>
        <Form onSubmit={handleSubmit(() => {})}>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Esquema</Form.Label>
            <Form.Select
              aria-label="Default select example"
              {...register("esquemaNombre", { required: true })}
              onChange={handleChange}>
              <option value=""></option>
              <option value="1">
                El Florido/Amatillo/Las Manos/Corinto/Agua Caliente
              </option>
              {/* <option value="2">Puerto Castilla</option> */}
              <option value="3">Puerto Cortés</option>
              <option value="4">La Mesa</option>
              <option value="5">El Poy</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Bloque</Form.Label>
            <Form.Select
              aria-label="Default select example"
              {...register("esquemaNombre", { required: true })}>
              {opcionRotuladores.map((element, i) => {
                return (
                  <option value={{}} key={i}>
                    {element}
                  </option>
                );
              })}
            </Form.Select>
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
        <textarea style={{ width: "100%", height: "100%" }}></textarea>
      </div>
    </div>
  );
}

export default Rotuladores;
