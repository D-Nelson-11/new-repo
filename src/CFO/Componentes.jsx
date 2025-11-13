import { set, useForm } from "react-hook-form";
import { Form, Col, Row, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "../api/axios";
import { toast } from "sonner";
import ClientesSelect from "../components/ClientesSelect";
import Tabla from "../components/Tabla";
import FormEdit from "./FormEdit";

function Componentes() {
  const { register, handleSubmit, getValues } = useForm();
  const [data, setData] = useState([]);
  const [escalas, setEscalas] = useState([]);
  const [parametros, setParametros] = useState({});
  let [mostrar, setMostrar] = useState(false);
  let [negociaciones, setNegociaciones] = useState([]);
  let [componentes, setComponentes] = useState([]);
  let [buscarPor, setBuscarPor] = useState("Ninguno");

  const columns = [
    { id: "IdMatValor", label: "IdValor", minWidth: 100, align: "left" },
    { id: "materialsegmento", label: "MaterialSegmentoId", minWidth: 100, align: "left" },
    { id: "Descripcion", label: "Componente", minWidth: 100, align: "left" },
    { id: "MatDesc", label: "Material", minWidth: 100, align: "left" },
    { id: "valor", label: "Valor", minWidth: 100, align: "left" },
    { id: "costo", label: "Costo", minWidth: 100, align: "left" },
    { id: "CodigoErp", label: "Codigo", minWidth: 100, align: "left" },
    { id: "Moneda", label: "Moneda", minWidth: 100, align: "left" },
    // { id: "IndicadorImpuestoMaterial", label: "Imp", minWidth: 100, align:"left" },
    // { id: "SEGMENTO", label: "Segmento", minWidth: 100, align: "left" },
    { id: "Opciones", label: "Opciones", minWidth: 80, align: "left" },

  ];

  const columnsVariables = [
  { id: "MaterialVariableValorId", label: "MaterialVarValorId", minWidth: 100, align: "left" },
  { id: "materialsegmentoId", label: "MaterialSegmentoId", minWidth: 100, align: "left" },
  { id: "componente", label: "Componente", minWidth: 100, align: "left" },
  { id: "Descripcion", label: "Descripción", minWidth: 100, align: "left" },
  { id: "valor", label: "Valor", minWidth: 100, align: "left" },
  { id: "costo", label: "Costo", minWidth: 100, align: "left" },
  { id: "CodigoErp", label: "Codigo", minWidth: 100, align: "left" },
  { id: "Currency_value", label: "Moneda", minWidth: 100, align: "left" },
  { id: "tipo", label: "Tipo", minWidth: 100, align: "left" },
  // { id: "ID", label: "Segmento", minWidth: 100, align: "left" },
  // { id: "Marca", label: "Marca", minWidth: 100, align: "left" },
  { id: "Opciones", label: "Opciones", minWidth: 80, align: "left" },
]


  const handleInputChange = (index, value, id) => {
    setParametros((prev) => ({ ...prev, [index]: value, id }));
  };

  const handleProbarClick = async (index) => {
    const valor = parametros[index];
    const json = {
      MaterialVariableValorId: parametros.id,
      Parametro: valor,
    };

    const resp = await axios.get(
      `http://localhost:4000/api/probarEscala/${valor}/${parametros.id}`
    );
    alert(
      "valor = " +
        resp.data.Message.Valor +
        " " +
        "Costo = " +
        resp.data.Message.Costo
    );
  };

  const [expandedRow, setExpandedRow] = useState(null);
  const toggleRow = async (index, MaterialVariableValorId) => {
    const response = await axios.get(
      `http://localhost:4000/api/getEscalas/${MaterialVariableValorId}`
    );
    setEscalas(response.data);
    setExpandedRow(expandedRow === index ? null : index);
  };
  return (
    <div className="w-100">
      <Form
        className="w-100"
        onSubmit={handleSubmit(async (data) => {
          if (buscarPor === "Componente") {
            toast.promise(
              (async () => {
                const response = await axios.get(
                  `http://localhost:4000/api/getComponenteById/${data.Id}`
                );
                console.log(response.data[0].length > 0);
                if (response.data[0].length > 0 || response.data[1].length > 0) {
                  return response.data;
                } else {
                  throw new Error("No tiene materiales.");
                }
              }),
              {
                loading: "Buscando materiales...",
                success: (data) => {
                  setData(data);
                  return `Materiales encontrados`;
                },
                error: (error) => {
                  return error.message;
                },
              }
            );
          }else{
                  toast.promise(
            (async () => {
              const response = await axios.get(
                `http://localhost:4000/api/getNegociacionesByClienteId/${data.IdCliente}`
              );
              console.log(response.data);

              if (response.data.length > 0) {
                return response.data;
              } else {
                throw new Error("Componente no tiene materiales.");
              }
            })(),
            {
              loading: "Buscando...",
              success: (data) => {
                setNegociaciones(data);
                setMostrar(true);
                return `Negociaciones encontradas: ${data.length}`;
              },
              error: () => "Este cliente no tiene negociaciones.",
            }
          );
          }
        })}>
        <Row>
          <Col className="col-2">
            <Form.Label>Buscar por</Form.Label>
            <Form.Select
              onChange={(e) => {
                setBuscarPor(e.target.value);
                if (e.target.value === "Componente") {
                  setMostrar(false);
                }
              }}>
              <option value="">--Seleccione--</option>
              <option value="Cliente">Cliente</option>
              <option value="Componente">Componente</option>
            </Form.Select>
          </Col>
          {buscarPor === "Cliente" && (
            <Col className="col-3">
              <Form.Label>Cliente</Form.Label>
              <ClientesSelect register={register} />
            </Col>
          )}
          {buscarPor === "Componente" && (
            <Col className="col-3">
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1">
                <Form.Label>ComponenteId</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Id"
                  {...register("Id")}
                />
              </Form.Group>
            </Col>
          )}
          {mostrar && (
            <>
              {/* *************************** SELECCIONAR NEGOCIACION ************************************ */}
              <Col className="col-2">
                <Form.Label>Negociación</Form.Label>
                <Form.Select
                  onChange={async (e) => {
                    console.log(e.target.value);
                    const response = await axios.get(
                      `http://localhost:4000/api/getComponentesByNegociacionId/${e.target.value}`
                    );
                    console.log(response.data);
                    setComponentes(response.data);
                  }}>
                  <option value="">--Seleccione--</option>
                  {negociaciones.map((negociacion) => (
                    <option key={negociacion.Id} value={negociacion.Id}>
                      {negociacion.Descripcion}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              {/* *************************** SELECCIONAR COMPONENTE ************************************ */}
              <Col className="col-3">
                <Form.Label>Componente</Form.Label>
                <Form.Select
                  onChange={async (e) => {
                    toast.promise(
                      (async () => {
                        const response = await axios.get(
                          `http://localhost:4000/api/getComponenteById/${e.target.value}`
                        );
                        console.log(response.data);
                        if (response.data.length > 0) {
                          return response.data;
                        } else {
                          throw new Error("Componente no tiene materiales.");
                        }
                      })(),
                      {
                        loading: "Buscando...",
                        success: (data) => {
                          setData(data);
                          return `Materiales encontrados`;
                        },
                        error: () => "Este componente no tiene materiales.",
                      }
                    );
                  }}>
                  <option value="">--Seleccione--</option>
                  {componentes.map((componente) => (
                    <option key={componente.Id} value={componente.Id}>
                      {componente.Descripcion}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </>
          )}
          {buscarPor !== "Ninguno" && (
            <Col className="col-2">
              <Button
                style={{
                  marginTop: "33px",
                  backgroundColor: "#4a5a85",
                  color: "white",
                  border: "none",
                }}
                type="submit">
                Buscar
              </Button>
            </Col>
          )}
        </Row>
      </Form>

      <Row className="mt-2 p-3">
        {/* //el set es para actualizar la tabla despues de editar */}
        {data.length > 0 && <Tabla columns={columns} rows={data[0]} titulo ={"Flat"} ContenidoModalEditar={(data, set) => <FormEdit datos={data} setDatos={set} />} />} 
      </Row>

      <Row className="mt-2 p-3">
        {data.length > 0 && <Tabla columns={columnsVariables} rows={data[1]} titulo={"Variable"} ContenidoModalEditar={(data, set) => <FormEdit datos={data} setDatos={set} />} />}
      </Row>
    </div>
  );
}

export default Componentes;
