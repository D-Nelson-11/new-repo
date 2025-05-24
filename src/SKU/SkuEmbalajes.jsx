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


  const onSubmit = async (values) => {

    const formatted = values.data
    .split("\n")
    .filter((line) => line.trim() !== "") // Elimina líneas vacías
    .map((line) => `'${line.trim()}'`) // Envuelve en comillas simples
    .join(", "); // Une con comas

  setValue("data", formatted); // Actualiza el textarea con los valores formateados

    let confirmar = confirm("¿Estás seguro de enviar los datos?");
    if (!confirmar) return;
    setCargando(true);
    const perro = values.data.split("\n");

    for (let id of perro) {
      let jsonTipoEmbalaje = {
        SkuId: id,
        TipoEmbalajeId: values.IdTipoEmbalaje,
        UnidadMedida: "KILOGRAMOS",
        UnidadesxEmbalaje: 1,
        PesoxPallet: 0,
        PesoxEmbalaje: 0,
        UnidadesxPallet: 0,
        PesoxEmbalajeProducto: 0,
        Largomm: 0,
        Anchomm: 0,
        Altomm: 0,
        UnidadMedidaId: 1,
      };
      try {
        const response = await axios.post(
          "https://personasapi.vesta-accelerate.com/api/SkuTipoEmbalaje/Create",jsonTipoEmbalaje);
        console.log(`${id}: ${response.data.IsValid}`);
      } catch (error) {
        console.log(error);
      }
    }

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
              <Form.Select className="mb-2" {...register("IdTipoEmbalaje", { required: true })}>
              <option value="">Selecciona</option>
                  <option value="49ce84ba-3efd-40dc-905b-22cc50ef012e">Pallet</option>
                  <option value="c6958aa7-9f7f-426b-aae8-20950b665e14">Bulto</option>
                  <option value="4300448F-7EAC-4CB6-A54F-1DC21B800F2C">Caja</option>
                  <option value="75bc7cc3-a31e-4760-afaa-17287453e03e">Bolsa</option>
                  <option value="d25d5f79-feb1-40da-ba74-1da1b67333cd">Lamina</option>
                  <option value="4ce88b3f-5569-4ea0-bbe4-1dda85eb7eea">Unidad</option>
                  <option value="F125C166-0DF3-48A8-ADCE-17055DFBD5FB">Sacos</option>
                  <option value="c7d4a814-4d4e-4905-9016-22eaab9d7d60">Pipas</option>

              </Form.Select>
            </Col>
          </Row>

          <Row className="d-flex flex-wrap justify-content-between">
            <Col>
              <textarea
                 style={{
                  width: "100%",
                  overflow: "auto", // Permite scroll cuando el contenido es muy grande
                  height:"auto",
                  whiteSpace: "nowrap", // Mantiene todo en una línea
                }}
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
