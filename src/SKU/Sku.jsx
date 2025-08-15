import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import axios from "../api/axios";
import SkuJson from "./json.json";
import { colors } from "../theme/colors";
import {toast} from 'sonner'

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
  let [stage, setStage] = useState(1);
  let [btnForm1, setbBtnForm1] = useState();
  let [btnForm2, setbBtnForm2] = useState();
  let [btnForm3, setbBtnForm3] = useState();
  let [btnForm4, setbBtnForm4] = useState();
  const [skuCliente, setSkuCliente] = useState("");
  const [skuProveedor, setSkuProveedor] = useState("");
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    async function ObtenerDatos() {
      try {
        const resp2 = await axios.get(
          "https://personasapi.vesta-accelerate.com/api/PersonaClienteServiceApi/GetAllClientes"
        );
        setClientes(
          resp2.data
            .map((cliente) => ({
              Id: cliente.Id,
              Nombre: cliente.Nombre,
            }))
            .sort((a, b) => a.Nombre.localeCompare(b.Nombre)) // Ordenar alfabéticamente
        );
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    }
    ObtenerDatos();
  }, []);

  if (loading) {
    return <div>Cragando...</div>;
  }

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
    setCategoriaVestaId("");
  };

  return (
    <div className="w-100 d-flex">
      <div style={{ width: "60%" }} className="d-flex flex-wrap">
        <div className="m-1 p-2 border border-1 rounded-2 ">
          <Form
            onSubmit={form1.handleSubmit(async (values) => {
              if (btnForm1 === 0) {
                setTextArea(
                  JSON.stringify(
                    {
                      ...values,
                      PersonaJuridicaClienteId:
                        values.PersonaJuridicaClienteId.split(",")[0],
                      PersonaJuridicaClienteNombre:
                        values.PersonaJuridicaClienteId.split(",")[1],
                      CategoriaVestaId: values.CategoriaVestaId.split(",")[0],
                      Categoria: values.CategoriaVestaId.split(",")[1],
                    },
                    null,
                    2
                  )
                );
              } else {
                if (stage == "1") {
                  const aceptar = confirm("¿Realizar acción en PRODUCCION?");
                  if (aceptar) {
                    try {
                      const resp = await axios.post(
                        "https://personasapi.vesta-accelerate.com/api/SkuInboundCliente/Create",textArea);
                      setSkuCliente(resp.data.Message.Id);
                      form4.setValue(
                        "SkuInboundClienteId",
                        resp.data.Message.Id
                      );
                      toast.success("Sku Cliente creado exitosamente");
                    } catch (error) {
                      console.log(error)
                      toast.error(`Error, revisa si el código ${values.Codigo} ya existe para este cliente`);
                    }
                  }
                } else {
                  const aceptar = confirm("¿Realizar acción en STAGE");
                  if (aceptar) {
                    try {
                      const resp = await axios.post(
                        "https://personasws.vestadev-accelerate.com/api/SkuInboundCliente/Create",
                        values
                      );
                      setSkuCliente(resp.data.Message.Id);
                      form4.setValue(
                        "SkuInboundClienteId",
                        resp.data.Message.Id
                      );
                    } catch (error) {
                      alert(JSON.stringify(error.response.data));
                      console.log(error);
                    }
                  }
                }
              }
            })}>
            <h5>1. SKU CLIENTE</h5>
            <Row>
              <Col className="col-4">
                <label htmlFor="" style={{ fontSize: "13px" }}>
                  Cliente
                </label>
                <Form.Select
                  {...form1.register("PersonaJuridicaClienteId")}
                  onChange={async (e) => {
                    setCategorias([]);
                    const resp = await axios.get(
                      `https://personasapi.vesta-accelerate.com/api/CategoriaVesta/LoadSkuXcategoriaVestaId/${
                        e.target.value.split(",")[0]
                      }`
                    );
                    setCategorias(resp.data);
                  }}>
                  {clientes.map((cliente) => (
                    <option
                      key={cliente.Id}
                      value={[cliente.Id, cliente.Nombre]}>
                      {cliente.Nombre}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col className="col-4">
                <label htmlFor="" style={{ fontSize: "13px" }}>
                  Descripcion
                </label>
                <Form.Control
                  placeholder="Descripción"
                  size="sm"
                  {...form1.register("Descripcion", { required: true })}
                  onChange={(e) => {
                    setDescripcion(e.target.value);
                    form2.setValue("Descripcion", e.target.value);
                  }}
                />
              </Col>
              <Col className="col-4">
                <label htmlFor="" style={{ fontSize: "13px" }}>
                  Codigo
                </label>
                <Form.Control
                  placeholder="Código"
                  size="sm"
                  {...form1.register("Codigo", { required: true })}
                  onChange={(e) => {
                    setCodigo(e.target.value);
                    form2.setValue("Codigo", e.target.value);
                  }}
                />
              </Col>
              <Col className="col-4">
                <label htmlFor="" style={{ fontSize: "13px" }}>
                  CategoriaVesta
                </label>
                <Form.Select {...form1.register("CategoriaVestaId")} onChange={(e)=>{
                        setCategoriaVestaId(e.target.value.split(",")[0]);
                        form2.setValue("CategoriaVestaId", e.target.value.split(",")[0]);
                }}>
                  <option value="">--Seleccione--</option>
                  {categorias.length > 0 &&
                    categorias.map((categoria) => (
                      <option
                        key={categoria.Id}
                        value={[categoria.Id, categoria.Descripcion]}>
                        {categoria.Descripcion}
                      </option>
                    ))}
                </Form.Select>
              </Col>
              <Col>
                <label htmlFor="" style={{ fontSize: "13px" }}>
                  Presentacion
                </label>
                <Form.Control
                  placeholder="Presentación"
                  size="sm"
                  {...form1.register("Presentacion")}
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
                    backgroundColor: colors.colorAzulGeneral,
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
            onSubmit={form2.handleSubmit(async (values) => {
              if (btnForm2 === 0) {
                setTextArea(JSON.stringify(values, null, 2));
              } else {
                if (stage == "1") {
                  const aceptar = confirm("¿Realizar acción en  PRODUCCION?");
                  if (aceptar) {
                    try {
                      const resp = await axios.post(
                        "https://personasapi.vesta-accelerate.com/api/SkuProveedor/Create",
                        textArea
                      );
                      console.log(resp)
                      if (resp.data.Message == "Este codigo ya existe para este Proveedor") {
                        toast.error(`Error, el código ${values.Codigo} ya existe para este proveedor`);
                        return;
                      }

                      setSkuProveedor(resp.data.Message.Id);
                      form4.setValue("SkuProveedorId", resp.data.Message.Id);
                      form3.setValue("SkuId", resp.data.Message.Id);
                      toast.success("Sku Proveedor creado exitosamente");
                    } catch (error) {
                      toast.error(`Error, revisa si el código ${values.Codigo} ya existe para este proveedor`);
                    }
                  }
                } else {
                  const aceptar = confirm("¿Realizar acción en STAGE?");
                  if (aceptar) {
                    try {
                      const resp = await axios.post(
                        "https://personasws.vestadev-accelerate.com/api/SkuProveedor/Create",
                        textArea
                      );
                      setSkuProveedor(resp.data.Message.Id);
                      form4.setValue("SkuProveedorId", resp.data.Message.Id);
                      form3.setValue("SkuId", resp.data.Message.Id);
                    } catch (error) {
                      alert(error);
                    }
                  }
                }
              }
            })}>
            <h5>2. SKU PROVEEDOR</h5>
            <Row>
              <Col lg={4}>
                <label htmlFor="" style={{ fontSize: "13px" }}>
                  PersonaProveedorId
                </label>
                <Form.Control
                  placeholder="PersonaProveedorId"
                  size="sm"
                  {...form2.register("PersonaProveedorId", { required: true })}
                />
              </Col>
              <Col lg={4}>
                <label htmlFor="" style={{ fontSize: "13px" }}>
                  Descripcion
                </label>
                <Form.Control
                  placeholder="Descripción"
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
                  placeholder="Código"
                  size="sm"
                  {...form2.register("Codigo")}
                  value={codigo}
                />
              </Col>
              {/* <Col lg={4}>
                <label htmlFor="" style={{ fontSize: "13px" }}>
                  Marca
                </label>
                <Form.Control
                  placeholder=""
                  size="sm"
                  {...form2.register("Marca")}
                />
              </Col> */}
              {/* <Col lg={4}>
                <label htmlFor="" style={{ fontSize: "13px" }}>
                  Composicion
                </label>
                <Form.Control
                  placeholder=""
                  size="sm"
                  {...form2.register("Composicion")}
                />
              </Col> */}
              <Col lg={4}>
                <label htmlFor="" style={{ fontSize: "13px" }}>
                  CategoriaVestaId
                </label>
                <Form.Control
                  placeholder="CategoriaVestaId"
                  size="sm"
                  {...form2.register("CategoriaVestaId")}
                  value={categoriaVestaId}
                />
              </Col>
              {/* <Col lg={4}>
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
              </Col> */}
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
                    backgroundColor: colors.colorAzulGeneral,
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
            onSubmit={form3.handleSubmit(async (values) => {
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
                }else if (values.tipoEmbalaje == 6) {
                  const updatedJsonTipoEmbalaje = { ...jsonTipoEmbalaje[5] };
                  updatedJsonTipoEmbalaje.SkuId = values.SkuId;
                  setTextArea(JSON.stringify(updatedJsonTipoEmbalaje, null, 2));
                }else if (values.tipoEmbalaje == 7) {
                  const updatedJsonTipoEmbalaje = { ...jsonTipoEmbalaje[6] };
                  updatedJsonTipoEmbalaje.SkuId = values.SkuId;
                  setTextArea(JSON.stringify(updatedJsonTipoEmbalaje, null, 2));
                }
              } else {
                if (stage == "1") {
                  const aceptar = confirm("¿Realizar acción en  PRODUCCION?");
                  if (aceptar) {
                    try {
                      const resp = await axios.post(
                        "https://personasapi.vesta-accelerate.com/api/SkuTipoEmbalaje/Create",
                        textArea
                      );
                      toast.success("Embalaje creado exitosamente");
                      console.log(resp);
                    } catch (error) {
                      toast.error("Error al crear el embalaje");
                      console.log(error);
                    }
                  }
                }
              }
            })}>
            <h5>2. SKU TIPO EMBALAJE</h5>
            <Row>
              <Col>
                <label htmlFor="" style={{ fontSize: "13px", width: "100%" }}>
                  SkuProveedorId
                </label>
                <Form.Control
                  placeholder="SkuProveedorId"
                  size="sm"
                  {...form3.register("SkuId", { required: true })}
                  // value={skuProveedor}
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
                  <option value="6">Sacos</option>
                  <option value="7">Unidad</option>
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
                    backgroundColor: colors.colorAzulGeneral,
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
            onSubmit={form4.handleSubmit(async (values) => {
              if (btnForm4 === 0) {
                setTextArea(JSON.stringify(values, null, 2));
              } else {
                if (stage == "1") {
                  const aceptar = confirm("¿Realizar acción en  PRODUCCION?");
                  if (aceptar) {
                    try {
                      const resp = await axios.post(
                        "https://personasapi.vesta-accelerate.com/api/SkuInboundClienteSkuProveedor/Create",
                        textArea
                      );
                      console.log(resp);
                      toast.success("Relación Sku Cliente-Proveedor creado exitosamente");
                    } catch (error) {
                      toast.error("Error al crear relación Cliente-Proveedor");
                      console.log(resp);
                    }
                  }
                }
              }
            })}>
            <Row>
              <Col>
                <label htmlFor="" style={{ fontSize: "13px" }}>
                  SkuInboundClienteId
                </label>
                <Form.Control
                  placeholder="SkuInboundClienteId"
                  size="sm"
                  {...form4.register("SkuInboundClienteId", { required: true })}
                  // value={skuCliente}
                />
              </Col>
              <Col>
                <label htmlFor="" style={{ fontSize: "13px" }}>
                  SkuProveedorId
                </label>
                <Form.Control
                  placeholder="SkuProveedorId"
                  size="sm"
                  {...form4.register("SkuProveedorId", { required: true })}
                  // value={skuProveedor}
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
                    backgroundColor: colors.colorAzulGeneral,
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
          <Button className="mb-1 w-100" onClick={clearAll} style={{backgroundColor: colors.colorRojoGeneral, border:"none"}}>
            Limpiar todo
          </Button>
          {/* <Form.Select
            aria-label="Default select example"
            className="w-50"
            onChange={(e) => {
              setStage(e.target.value);
            }}>
            <option value="1">Produccion</option>
          </Form.Select> */}
        </div>
        <div style={{ width: "100%", height: "100%" }} className="">
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
