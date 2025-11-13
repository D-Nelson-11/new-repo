import React from "react";
import { useForm } from "react-hook-form";
import { Form, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "../api/axios";
import { toast } from "sonner";

function FormEdit(row) {
  const { handleSubmit, register } = useForm();

  useEffect(() => {
    console.log(row);
  }, []);
  return (
    <div style={{ width: "100%" }}>
      <Form
        onSubmit={handleSubmit(async (data) => {
          console.log(data);
          try {
            toast.promise(
              async () => {
                if (row.datos.IdMatValor) {
                  const response = await axios.put(
                    `http://localhost:4000/api/updateMaterialFlatValor`,
                    { ...data, id: row.datos.IdMatValor }
                  );
                } else {
                  const response = await axios.put(
                    `http://localhost:4000/api/updateMaterialVariableValor`,
                    { ...data, id: row.datos.MaterialVariableValorId }
                  );
                }
                const updatedData = await axios.get(
                  `http://localhost:4000/api/getComponenteById/${row.datos.ComponenteId}`
                );
                if (row.datos.IdMatValor) {
                  row.setDatos(updatedData.data[0]);
                } else {
                  row.setDatos(updatedData.data[1]);
                }
              },
              {
                loading: "Editando...",
                success: (data) => {
                  return `Material editado correctamente.`;
                },
                error: (error) => {
                  return error.message;
                },
              }
            );
          } catch (error) {
            console.error("Error al actualizar el material:", error);
          }
        })}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Valor</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter email"
            defaultValue={row?.datos.valor}
            {...register("valor")}
          />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Costo</Form.Label>
          <Form.Control
            type="text"
            placeholder="Password"
            defaultValue={row?.datos.costo}
            {...register("costo")}
          />
        </Form.Group>

        <Button variant="success" type="submit" className="mt-3 w-100">
          Guardar
        </Button>
      </Form>
    </div>
  );
}

export default FormEdit;
