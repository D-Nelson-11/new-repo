import React from "react";
import { useForm } from "react-hook-form";
import { Form, Button, Col, Row } from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "../api/axios";
import ClientesSelect from "../components/ClientesSelect";
function SkusCargill() {
  const { handleSubmit, register, setValue } = useForm();
  let [textAreaValue, setTextAreaValue] = useState([]);
  let [cargando, setCargando] = useState(false);
  let [tiposEmbalajes, setTiposEmbalajes] = useState([]);
  let [cantidadIdsCod, setCantidadIdsCod] = useState(0);
  let [cantidadIdsDesc, setCantidadIdsDesc] = useState(0);
  const [clientes, setClientes] = useState([]);
  const [categorias, setCategorias] = useState([]);
  let [paso, setPaso] = useState("");

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
      } catch (error) {
        console.error(error);
      }
    }
    ObtenerDatos();
  }, []);

  const onSubmit = async (values) => {
    const formattedCodigos = values.cantidadIdsCod
      .split("\n")
      .filter((line) => line.trim() !== "") // Elimina líneas vacías
      .join(", "); // Une con comas

    const formattedDescripciones = values.cantidadIdsDesc
      .split("\n")
      .filter((line) => line.trim() !== "") // Elimina líneas vacías
      .join(", "); // Une con comas

    let confirmar = confirm("¿Estás seguro de enviar los datos?");
    if (!confirmar) return;

    const arrayDescripciones = formattedDescripciones.split(", ");
    const arrayCodigos = formattedCodigos.split(", ");

    let json1 = {
      PersonaJuridicaClienteId: values.PersonaJuridicaClienteId.split(",")[0],
      PersonaJuridicaClienteNombre:
        values.PersonaJuridicaClienteId.split(",")[1],
      Descripcion: "",
      Codigo: "",
      CategoriaVestaId: values.CategoriaVestaId.split(",")[0],
      Presentacion: "0",
      Categoria: values.CategoriaVestaId.split(",")[1],
    };

    let json2 = {
      PersonaProveedorId: values.PersonaProveedorId,
      Descripcion: "",
      Codigo: "",
      CategoriaVestaId: values.CategoriaVestaId.split(",")[0],
    };

    let json3 = {
        SkuId: "",
        TipoEmbalajeId: values.IdTipoEmbalaje,
        UnidadMedida: "UNIDAD",
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

      let json4 = {
      "SkuInboundClienteId": "",
      "SkuProveedorId": ""
      };

    for (let i = 0; i < arrayCodigos.length; i++) {
      json1.Descripcion = arrayDescripciones[i];
      json1.Codigo = arrayCodigos[i];

      json2.Descripcion = arrayDescripciones[i];
      json2.Codigo = arrayCodigos[i];
      try {
        setPaso(`el sku cliente ${i+1}`)
        const respSkuCliente = await axios.post("https://personasapi.vesta-accelerate.com/api/SkuInboundCliente/Create",json1);
        setPaso(`el sku proveedor ${i+1}`)
        const respSkuProveedor = await axios.post("https://personasapi.vesta-accelerate.com/api/SkuProveedor/Create",json2);
        json3.SkuId = respSkuProveedor.data.Message.Id;
        json4.SkuInboundClienteId = respSkuCliente.data.Message.Id;
        json4.SkuProveedorId = respSkuProveedor.data.Message.Id;
        setPaso(`el sku embalaje ${i+1}`)
        const respEmbalaje = await axios.post("https://personasapi.vesta-accelerate.com/api/SkuTipoEmbalaje/Create",json3);
        setPaso(`la relacion cliente-proveedor ${i+1}`)
        const respRelacion = await axios.post("https://personasapi.vesta-accelerate.com/api/SkuInboundClienteSkuProveedor/Create",json4);
      } catch (error) {
        console.log(error);
        if ( error.request.responseURL.toString() == "https://personasapi.vesta-accelerate.com/api/SkuInboundCliente/Create"){
          const obtenerSkuIdCliente = await axios.post('https://personasapi.vesta-accelerate.com/api/SkuInboundCliente/ListSkuInboundClienteByCodigo',
          {
          "PersonaJuridicaClienteId": values.PersonaJuridicaClienteId.split(",")[0],
          "Codigos": [
            arrayCodigos[i]
          ]
        })
            console.log(obtenerSkuIdCliente.data[0].Id);
            setPaso(`el sku proveedor ${i+1}`)
            console.log(json2);
            const respSkuProveedor = await axios.post("https://personasapi.vesta-accelerate.com/api/SkuProveedor/Create",json2);
            console.log('vine')
            json3.SkuId = respSkuProveedor.data.Message.Id;
            json4.SkuInboundClienteId = obtenerSkuIdCliente.data[0].Id;
            json4.SkuProveedorId = respSkuProveedor.data.Message.Id;
            setPaso(`el sku embalaje ${i+1}`)
            const respEmbalaje = await axios.post("https://personasapi.vesta-accelerate.com/api/SkuTipoEmbalaje/Create",json3);
            setPaso(`la relacion cliente-proveedor ${i+1}`)
            const respRelacion = await axios.post("https://personasapi.vesta-accelerate.com/api/SkuInboundClienteSkuProveedor/Create",json4);
          // json4.SkuProveedorId = obtenerSkuIdCliente.data.Message.Id;
        }
      }
    }
    setPaso("Nada perrin, ya terminé");
  };

  return (
    <div className="d-flex w-75 flex-wrap m-auto mt-1">
      <div style={{ width: "100%" }}>
        <Form
          onSubmit={handleSubmit(onSubmit)}
          className="border border-1 p-2 rounded">
          <Row>
            <Col>
              <Form.Label>Cliente</Form.Label>
              <Form.Select
                {...register("PersonaJuridicaClienteId")}
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
                  <option key={cliente.Id} value={[cliente.Id, cliente.Nombre]}>
                    {cliente.Nombre}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col>
              <Form.Label>Categoría</Form.Label>
              <Form.Select
                {...register("CategoriaVestaId")}
                onChange={(e) => {
                  setCategoriaVestaId(e.target.value.split(",")[0]);
                  setValue("CategoriaVestaId", e.target.value.split(",")[0]);
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
          </Row>
          <Row>
            <Col>
              <Form.Label>Tipo de embalaje</Form.Label>
              <Form.Select
                className="mb-2"
                {...register("IdTipoEmbalaje", { required: true })}>
                <option value="">Selecciona</option>
                <option value="49ce84ba-3efd-40dc-905b-22cc50ef012e">
                  Pallet
                </option>
                <option value="c6958aa7-9f7f-426b-aae8-20950b665e14">
                  Bulto
                </option>
                <option value="4300448F-7EAC-4CB6-A54F-1DC21B800F2C">
                  Caja
                </option>
                <option value="afa84692-8f97-43a6-8651-19236a7d1bf7">
                  Bolsa
                </option>
                <option value="d25d5f79-feb1-40da-ba74-1da1b67333cd">
                  Lamina
                </option>
                <option value="4ce88b3f-5569-4ea0-bbe4-1dda85eb7eea">
                  Unidad
                </option>
                <option value="F125C166-0DF3-48A8-ADCE-17055DFBD5FB">
                  Sacos
                </option>
                <option value="c7d4a814-4d4e-4905-9016-22eaab9d7d60">
                  Pipas
                </option>
                <option value="da934b3c-50f6-40b6-8b67-24b2c757f3bc">
                  Flexitanque
                </option>
              </Form.Select>
            </Col>
            <Col>
              <Form.Label>ProveedorId</Form.Label>
              <Form.Control
                type="text"
                {...register("PersonaProveedorId", { required: true })}
                placeholder="ProveedorId"
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Label style={{ display: "block" }}>
                Descripciones
              </Form.Label>
              <textarea
                name="descripciones"
                id=""
                style={{ width: "100%", height: "100px" }}
                defaultValue=""
                {...register("cantidadIdsDesc", { required: true })}
                onChange={(e) => {
                  if (e.target.value === "") {
                    setCantidadIdsDesc(0);
                    return;
                  }
                  const cant = e.target.value.split("\n").length;
                  setCantidadIdsDesc(cant);
                }}></textarea>
              <p>Cantidad de Ids: {cantidadIdsDesc}</p>
            </Col>
            <Col>
              <Form.Label style={{ display: "block" }}>Códigos</Form.Label>
              <textarea
                name="Codigos"
                id=""
                style={{ width: "100%", height: "100px" }}
                defaultValue=""
                {...register("cantidadIdsCod", { required: true })}
                onChange={(e) => {
                  if (e.target.value === "") {
                    setCantidadIdsCod(0);
                    return;
                  }
                  const cant = e.target.value.split("\n").length;
                  setCantidadIdsCod(cant);
                }}></textarea>
              <p>Cantidad de Ids: {cantidadIdsCod}</p>
            </Col>
          </Row>
          <Row>
            <p>Estoy haciendo: {paso} </p>  
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
                  setValue("cantidadIdsDesc", ""); // Limpiar el contenido correctamente
                  setCantidadIdsDesc(0); // Reiniciar la cantidad de líneas
                  setValue("cantidadIdsCod", ""); // Limpiar el contenido correctamente
                  setCantidadIdsCod(0); // Reiniciar la cantidad de líneas
                }}>
                Limpiar
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
}

export default SkusCargill;
