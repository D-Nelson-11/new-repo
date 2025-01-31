import React from "react";
import { useForm } from "react-hook-form";
import { Form, Button, Col, Row } from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "../api/axios";

function SkuEmbalajes() {
  const { handleSubmit, register, setValue } = useForm();
  let [textAreaValue, setTextAreaValue] = useState([]);
  let [cargando, setCargando] = useState(false);
  let [tiposEmbalajes, setTiposEmbalajes] = useState([]);
  let [cantidadIds, setCantidadIds] = useState(0);

  useEffect(() => {
    const getTiposEmbalajes = async () => {
      try {
        const response = await axios.get(
          "https://personasapi.vesta-accelerate.com/api/TipoEmbalaje/Index"
        );
        setTiposEmbalajes(response.data.Message);
      } catch (error) {
        console.log(error);
      }
    };
    getTiposEmbalajes();
  }, []);

  const onSubmit = async (values) => {
    setCargando(true);

    const perro = values.data.split("\n");

    for (let id of perro) {
      try {
        const response = await axios.post(
          "https://personasapi.vesta-accelerate.com/api/Embalaje/Create",
          {
            IdTipoEmbalaje: values.IdTipoEmbalaje,
            IdSku: id,
          }
        );
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    }

    setTextAreaValue(ids);
    setCargando(false);
  };

  return (
    <div className="d-flex w-75 flex-wrap m-auto mt-1">
      <div style={{ width: "100%" }}>
        <Form
          onSubmit={handleSubmit(onSubmit)}
          className="border border-1 p-2 rounded">
          <Row>
            <Col>
              <Form.Label>Tipo de embalaje</Form.Label>
              <Form.Select className="mb-2">
                {tiposEmbalajes.map((tipoEmbalaje) => (
                  <option value={tipoEmbalaje.Id}>{tipoEmbalaje.Nombre}</option>
                ))}
              </Form.Select>
            </Col>
          </Row>

          <Row className="d-flex flex-wrap justify-content-between">
            <Col>
              <textarea
                style={{ width: "100%", height: "400px" }}
                defaultValue=""
                {...register("data", { required: true })}
                onChange={(e) => {
                  if (e.target.value === "") {
                    setCantidadIds(0);
                    return;
                  }
                  const cant = e.target.value.split("\n").length;
                  setCantidadIds(cant);
                }}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Button type="submit" className="w-100" variant="success">
                Enviar
              </Button>
            </Col>
            <Col>
              <Button
                className="w-100"
                onClick={() => {
                  setValue("data", ""); // Limpiar el contenido correctamente
                  setCantidadIds(0); // Reiniciar la cantidad de líneas
                }}>
                Limpiar
              </Button>
            </Col>
          </Row>
          <p>Cantidad de Ids: {cantidadIds}</p>
        </Form>
      </div>
    </div>
  );
}

export default SkuEmbalajes;
