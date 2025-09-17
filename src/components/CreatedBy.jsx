import { useEffect, useState } from "react";
import axios from "../api/axios";
import { Form } from "react-bootstrap";
function CreatedBy({ register }) {
  const usuarios = [
    { Id: "D7CCF64B-4700-4FF7-B0A7-246A08B41246", Nombre: "Gabriela" },
    { Id: "C183E6D0-6855-4613-A85D-24F1E30E165E", Nombre: "Fredy" },
    { Id: "0C3A7B92-34D7-453A-883F-24C15B24FF6A", Nombre: "David" },
    { Id: "3EF3F051-7D5D-436A-8118-22AFD860662B", Nombre: "Dany" },
    { Id: "F92928DC-1CDA-436C-8ECE-254FC151469C", Nombre: "Sandra" },
  ];
  return (
    <Form.Select
      {...register("CreadaPor", { required: true })}
      style={{
        display: "inline-block",
        width: "120px",
        marginLeft: "4px",
        borderRadius: "5px",
        border: "none",
        color: "black",
        fontSize: "12px",
        padding: "1px",
      }}>
      <option value="">--CreadaPor--</option>
      {usuarios.map((usuario) => (
        <option key={usuario.Id} value={usuario.Id}>
          {usuario.Nombre}
        </option>
      ))}
    </Form.Select>
  );
}

export default CreatedBy;
