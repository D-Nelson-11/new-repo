import React from "react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import axios from "../../api/axios";
import SkuJson from "./json.json";

export default function Sku() {
  const form1 = useForm();
  const form2 = useForm();
  const form3 = useForm();
  const form4 = useForm();
  const [textArea, setTextArea] = useState("");
  const [jsonTipoEmbalaje, setJsonTipoEmbalaje] = useState(SkuJson);
  let [descripcion, setDescripcion] = useState("");
  let [codigo, setCodigo] = useState("");
  let [categoriaVestaId, setCategoriaVestaId] = useState("");
  let [stage, setStage] = useState(0);
  let [btnForm1, setbBtnForm1] = useState();
  let [btnForm2, setbBtnForm2] = useState();
  let [btnForm3, setbBtnForm3] = useState();
  let [btnForm4, setbBtnForm4] = useState();

  const handleTextAreaChange = (event) => {
    setTextArea(event.target.value);
  };

  const clearAll = () => {
    form1.reset();
    form2.reset();
    form3.reset();
    form4.reset();
    setTextArea("");
    setDescripcion("");
    setCodigo("");
  };

  return (
    <div className="w-100 d-flex">
      <div style={{ width: "60%" }} className="d-flex flex-wrap">
        <div className="m-1 p-2 border border-1 rounded-2 ">
          <Form
            onSubmit={form1.handleSubmit(async(values) => {
              if (btnForm1 === 0) {
                setTextArea(JSON.stringify(values, null, 2));
              } else {
                if (stage == '1') {
                  const aceptar = confirm(
                    "¿seguro perrin?, la solicitud se va a hacer en PRODUCCION"
                  );
                  if (aceptar){
                    const resp = await axios.post('https://personasapi.vesta-accelerate.com/api/SkuInboundCliente/Create',values);
                    console.log(resp);
                  }
                }else{
                  const aceptar = confirm(
                    "¿seguro perrin?, la solicitud se va a hacer en STAGE"
                  );
                  if (aceptar){
                    const resp = await axios.post('https://personasws.vestadev-accelerate.com/api/SkuInboundCliente/Create',values);
                    console.log(resp);
                  }
                }
              }
            })}>
            <h5>1. SKU CLIENTE</h5>
            <Row>
              <Col lg={4}>
                <label htmlFor="" style={{ fontSize: "13px" }}>
                  PersonaJuridicaClienteId
                </label>
                <Form.Control
                  placeholder=""
                  size="sm"
                  {...form1.register("PersonaJuridicaClienteId", {
                    required: true,
                  })}
                />
              </Col>
              <Col lg={4}>
                <label htmlFor="" style={{ fontSize: "13px" }}>
                  PersonaJuridicaClienteNombre
                </label>
                <Form.Control
                  placeholder=""
                  size="sm"
                  {...form1.register("PersonaJuridicaClienteNombre", {
                    required: true,
                  })}
                />
              </Col>
              <Col lg={4}>
                <label htmlFor="" style={{ fontSize: "13px" }}>
                  Descripcion
                </label>
                <Form.Control
                  placeholder=""
                  size="sm"
                  {...form1.register("Descripcion", { required: true })}
                  onChange={(e) => {
                    setDescripcion(e.target.value);
                    form2.setValue("Descripcion", e.target.value);
                  }}
                />
              </Col>
              <Col>
                <label htmlFor="" style={{ fontSize: "13px" }}>
                  Codigo
                </label>
                <Form.Control
                  placeholder=""
                  size="sm"
                  {...form1.register("Codigo", { required: true })}
                  onChange={(e) => {
                    setCodigo(e.target.value);
                    form2.setValue("Codigo", e.target.value);
                  }}
                />
              </Col>
              <Col>
                <label htmlFor="" style={{ fontSize: "13px" }}>
                  Categoria
                </label>
                <Form.Control
                  placeholder=""
                  size="sm"
                  {...form1.register("Categoria", { required: true })}
                />
              </Col>
              <Col>
                <label htmlFor="" style={{ fontSize: "13px" }}>
                  CategoriaVestaId
                </label>
                <Form.Control
                  placeholder=""
                  size="sm"
                  {...form1.register("CategoriaVestaId", { required: true })}
                  onChange={(e) => {
                    setCategoriaVestaId(e.target.value);
                    form2.setValue("CategoriaVestaId", e.target.value);
                  }}
                />
              </Col>
            </Row>
            <Row>
              <Col className="d-flex justify-content-between">
                <button
                  onClick={() => setbBtnForm1(0)}
                  style={{
                    backgroundColor: "#a4a4a4",
                    width: "49.5%",
                    borderRadius: "5px",
                    border: "none",
                    marginTop: "3px",
                    color: "#fff",
                    fontSize: "12px",
                    padding: "3px",
                  }}>
                  generar
                </button>
                <button
                  onClick={() => setbBtnForm1(1)}
                  type="submit"
                  style={{
                    backgroundColor: "#5cb85c",
                    width: "49.5%",
                    borderRadius: "5px",
                    border: "none",
                    marginTop: "3px",
                    color: "#fff",
                    fontSize: "12px",
                    padding: "3px",
                  }}>
                  enviar
                </button>
              </Col>
            </Row>
          </Form>
        </div>
        {/***************************SKU PROVEEDOR***************************************/}
        <div className="m-1 p-2 border border-1 rounded-2">
          <Form
            onSubmit={form2.handleSubmit((values) => {
              if (btnForm2 === 0) {
                setTextArea(JSON.stringify(values, null, 2));
              } else {
                alert("simon");
              }
            })}>
            <h5>2. SKU PROVEEDOR</h5>
            <Row>
              <Col lg={4}>
                <label htmlFor="" style={{ fontSize: "13px" }}>
                  PersonaProveedorId
                </label>
                <Form.Control
                  placeholder=""
                  size="sm"
                  {...form2.register("PersonaProveedorId", { required: true })}
                />
              </Col>
              <Col lg={4}>
                <label htmlFor="" style={{ fontSize: "13px" }}>
                  Descripcion
                </label>
                <Form.Control
                  placeholder=""
                  size="sm"
                  {...form2.register("Descripcion")}
                  value={descripcion}
                />
              </Col>
              <Col lg={4}>
                <label htmlFor="" style={{ fontSize: "13px" }}>
                  Codigo
                </label>
                <Form.Control
                  placeholder=""
                  size="sm"
                  {...form2.register("Codigo")}
                  value={codigo}
                />
              </Col>
              <Col lg={4}>
                <label htmlFor="" style={{ fontSize: "13px" }}>
                  Marca
                </label>
                <Form.Control
                  placeholder=""
                  size="sm"
                  {...form2.register("Marca")}
                />
              </Col>
              <Col lg={4}>
                <label htmlFor="" style={{ fontSize: "13px" }}>
                  Composicion
                </label>
                <Form.Control
                  placeholder=""
                  size="sm"
                  {...form2.register("Composicion")}
                />
              </Col>
              <Col lg={4}>
                <label htmlFor="" style={{ fontSize: "13px" }}>
                  CategoriaVestaId
                </label>
                <Form.Control
                  placeholder=""
                  size="sm"
                  {...form2.register("CategoriaVestaId")}
                  value={categoriaVestaId}
                />
              </Col>
              <Col lg={4}>
                <label htmlFor="" style={{ fontSize: "13px" }}>
                  Caracteristicas
                </label>
                <Form.Control
                  placeholder=""
                  size="sm"
                  {...form2.register("Caracteristicas")}
                />
              </Col>
              <Col lg={4}>
                <label htmlFor="" style={{ fontSize: "13px" }}>
                  Estado
                </label>
                <Form.Control
                  placeholder=""
                  size="sm"
                  {...form2.register("Estado")}
                />
              </Col>
              <Col lg={4}>
                <label htmlFor="" style={{ fontSize: "13px" }}>
                  Traduccion
                </label>
                <Form.Control
                  placeholder=""
                  size="sm"
                  {...form2.register("Traduccion")}
                />
              </Col>
            </Row>
            <Row>
              <Col className="d-flex justify-content-between">
                <button
                  onClick={() => setbBtnForm2(0)}
                  style={{
                    backgroundColor: "#a4a4a4",
                    width: "49.5%",
                    borderRadius: "5px",
                    border: "none",
                    marginTop: "3px",
                    color: "#fff",
                    fontSize: "12px",
                    padding: "3px",
                  }}>
                  generar
                </button>
                <button
                  onClick={() => setbBtnForm2(1)}
                  type="submit"
                  style={{
                    backgroundColor: "#5cb85c",
                    width: "49.5%",
                    borderRadius: "5px",
                    border: "none",
                    marginTop: "3px",
                    color: "#fff",
                    fontSize: "12px",
                    padding: "3px",
                  }}>
                  enviar
                </button>
              </Col>
            </Row>
          </Form>
        </div>
        {/***************************SKU TIPO EMBALAJE***************************************/}

        <div
          className="m-1 p-2 border border-1 rounded-2"
          style={{ width: "35%" }}>
          <Form
            onSubmit={form3.handleSubmit((values) => {
              if (btnForm3 === 0) {
                if (values.tipoEmbalaje == 1) {
                  const updatedJsonTipoEmbalaje = { ...jsonTipoEmbalaje[0] };
                  updatedJsonTipoEmbalaje.SkuId = values.SkuId;
                  setTextArea(JSON.stringify(updatedJsonTipoEmbalaje, null, 2));
                } else if (values.tipoEmbalaje == 2) {
                  const updatedJsonTipoEmbalaje = { ...jsonTipoEmbalaje[1] };
                  updatedJsonTipoEmbalaje.SkuId = values.SkuId;
                  setTextArea(JSON.stringify(updatedJsonTipoEmbalaje, null, 2));
                } else if (values.tipoEmbalaje == 3) {
                  const updatedJsonTipoEmbalaje = { ...jsonTipoEmbalaje[2] };
                  updatedJsonTipoEmbalaje.SkuId = values.SkuId;
                  setTextArea(JSON.stringify(updatedJsonTipoEmbalaje, null, 2));
                } else if (values.tipoEmbalaje == 4) {
                  const updatedJsonTipoEmbalaje = { ...jsonTipoEmbalaje[3] };
                  updatedJsonTipoEmbalaje.SkuId = values.SkuId;
                  setTextArea(JSON.stringify(updatedJsonTipoEmbalaje, null, 2));
                } else if (values.tipoEmbalaje == 5) {
                  const updatedJsonTipoEmbalaje = { ...jsonTipoEmbalaje[4] };
                  updatedJsonTipoEmbalaje.SkuId = values.SkuId;
                  setTextArea(JSON.stringify(updatedJsonTipoEmbalaje, null, 2));
                }
              } else {
                alert("simon");
              }
            })}>
            <h5>2. SKU TIPO EMBALAJE</h5>
            <Row>
              <Col>
                <label htmlFor="" style={{ fontSize: "13px", width: "100%" }}>
                  SkuId
                </label>
                <Form.Control
                  placeholder=""
                  size="sm"
                  {...form3.register("SkuId", { required: true })}
                />
              </Col>
              <Col>
                <label htmlFor="" style={{ fontSize: "13px" }}>
                  Tipo Embalaje
                </label>
                <Form.Select
                  aria-label="Default select example"
                  style={{ height: "34px", fontSize: "13px", width: "100%" }}
                  {...form3.register("tipoEmbalaje", { required: true })}>
                  <option>Selecciona</option>
                  <option value="1">Pallet</option>
                  <option value="2">Bulto</option>
                  <option value="3">Caja</option>
                  <option value="4">Bolsa</option>
                  <option value="5">Lamina</option>
                </Form.Select>
              </Col>
            </Row>
            <Row>
              <Col className="d-flex justify-content-between">
                <button
                  onClick={() => setbBtnForm3(0)}
                  style={{
                    backgroundColor: "#a4a4a4",
                    width: "49.5%",
                    borderRadius: "5px",
                    border: "none",
                    marginTop: "3px",
                    color: "#fff",
                    fontSize: "12px",
                    padding: "3px",
                  }}>
                  generar
                </button>
                <button
                  onClick={() => setbBtnForm3(1)}
                  type="submit"
                  style={{
                    backgroundColor: "#5cb85c",
                    width: "49.5%",
                    borderRadius: "5px",
                    border: "none",
                    marginTop: "3px",
                    color: "#fff",
                    fontSize: "12px",
                    padding: "3px",
                  }}>
                  enviar
                </button>
              </Col>
            </Row>
          </Form>
        </div>
        {/***************************SKU CLIENTE PROVEEDOR***************************************/}
        <div
          className="m-1 p-2 border border-1 rounded-2"
          style={{ width: "60%" }}>
          <h5>4. SKU CLIENTE-PROVEEDOR</h5>
          <Form
            onSubmit={form4.handleSubmit((values) => {
              if (btnForm4 === 0) {
                setTextArea(JSON.stringify(values, null, 2));
              } else {
                alert("simon");
              }
            })}>
            <Row>
              <Col>
                <label htmlFor="" style={{ fontSize: "13px" }}>
                  SkuInboundClienteId
                </label>
                <Form.Control
                  placeholder=""
                  size="sm"
                  {...form4.register("SkuInboundClienteId", { required: true })}
                />
              </Col>
              <Col>
                <label htmlFor="" style={{ fontSize: "13px" }}>
                  SkuProveedorId
                </label>
                <Form.Control
                  placeholder=""
                  size="sm"
                  {...form4.register("SkuProveedorId", { required: true })}
                />
              </Col>
            </Row>
            <Row>
              <Col className="d-flex justify-content-between">
                <button
                  onClick={() => setbBtnForm4(0)}
                  style={{
                    backgroundColor: "#a4a4a4",
                    width: "49.5%",
                    borderRadius: "5px",
                    border: "none",
                    marginTop: "3px",
                    color: "#fff",
                    fontSize: "12px",
                    padding: "3px",
                  }}>
                  generar
                </button>
                <button
                  onClick={() => setbBtnForm4(1)}
                  type="submit"
                  style={{
                    backgroundColor: "#5cb85c",
                    width: "49.5%",
                    borderRadius: "5px",
                    border: "none",
                    marginTop: "3px",
                    color: "#fff",
                    fontSize: "12px",
                    padding: "3px",
                  }}>
                  enviar
                </button>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
      <div style={{ width: "40%" }} className="d-flex flex-wrap">
        <div className="d-flex flex-wrap w-100 justify-content-between">
          <Button className="mb-1 w-50" onClick={clearAll}>
            Limpiar todo
          </Button>
          <Form.Select
            aria-label="Default select example"
            className="w-50"
            onChange={(e) => {
              setStage(e.target.value);
            }}>
            <option>Selecciona</option>
            <option value="1">Produccion</option>
            <option value="0">Stage</option>
          </Form.Select>
        </div>
        <div style={{ width: "100%", height: "90%" }} className="">
          <textarea
            id=""
            style={{ width: "100%", height: "95%" }}
            value={textArea}
            onChange={handleTextAreaChange}></textarea>
        </div>
      </div>
    </div>
  );
}