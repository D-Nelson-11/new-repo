import { set, useForm } from "react-hook-form";
import { Form, Col, Row, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "../api/axios";
import { toast } from "sonner";
import ClientesSelect from "../components/ClientesSelect";
import Tabla from "../components/Tabla";

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
    { id: "Descripcion", label: "Componente", minWidth: 100, align: "left" },
    { id: "MatDesc", label: "Material", minWidth: 100, align: "left" },
    {
      id: "materialsegmento",
      label: "MaterialSegmentoId",
      minWidth: 100,
      align: "left",
    },
    { id: "valor", label: "Valor", minWidth: 100, align: "left" },
    { id: "costo", label: "Costo", minWidth: 100, align: "left" },
    { id: "CodigoErp", label: "Codigo", minWidth: 100, align: "left" },
    { id: "Moneda", label: "Moneda", minWidth: 100, align: "left" },
    // { id: "IndicadorImpuestoMaterial", label: "Imp", minWidth: 100, align:"left" },
    { id: "SEGMENTO", label: "Segmento", minWidth: 100, align: "left" },
  ];

  // useEffect(() => {
  //   console.log(ValorCliente);
  // }, []);

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
          // console.log(data);
          // const response = await axios.get(
          //   `http://localhost:4000/api/getComponenteById/${data.Id}`,
          //   data
          // );
          // if (response.data[0].length === 0 && response.data[1].length === 0) {
          //   toast.error("No tiene materiales.");
          //   return;
          // }
          // setData(response.data);
          // console.log(response.data);
    
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
          {/* <Col className="col-4">
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>ComponenteId</Form.Label>
              <Form.Control type="text" placeholder="Id" {...register("Id")} />
            </Form.Group>
          </Col>
          <Col className="col-4">
            <Button
              style={{ marginTop: "33px" }}
              variant="primary"
              type="submit">
              Buscar
            </Button>
          </Col> */}
        </Row>
      </Form>

      <Row className="mt-2">
        <h5 className="text-center">Flats</h5>
        {data.length > 0 && <Tabla columns={columns} rows={data[0]} />}
        {/* <table className="table table-striped table-bordered table-responsive">
          <thead>
            <tr>
              <th>IdValor</th>
              <th>Material</th>
              <th>Componente</th>
              <th>MaterialSegmentoId</th>
              <th>Valor</th>
              <th>Costo</th>
              <th>Codigo</th>
              <th>Moneda</th>
              <th>Imp</th>
              <th>Segmento</th>
            </tr>
          </thead>
          <tbody style={{ fontSize: "10px" }}>
            {data.length > 0 &&
              data[0].map((item, i) => (
                <tr key={i}>
                  <td>{item.IdMatValor}</td>
                  <td>{item.MatDesc}</td>
                  <td>{item.Descripcion}</td>
                  <td>{item.materialsegmento}</td>
                  <td>{item.valor}</td>
                  <td>{item.costo}</td>
                  <td>{item.CodigoErp}</td>
                  <td>{item.Moneda}</td>
                  <td>{item.IndicadorImpuestoMaterial}</td>
                  <td>{item.SEGMENTO}</td>
                </tr>
              ))}
          </tbody>
        </table> */}
      </Row>

      <Row>
        <h5 className="text-center">Variables</h5>
        <table className="table table-striped table-bordered table-responsive">
          <thead>
            <tr>
              <th>MaterialVarValorId</th>
              <th>Descripción</th>
              <th>Componente</th>
              <th>MaterialSegmentoId</th>
              <th>Valor</th>
              <th>Costo</th>
              <th>Codigo</th>
              <th>Moneda</th>
              <th>Tipo</th>
              <th>Segmento</th>
              <th>Marca</th>
            </tr>
          </thead>
          <tbody style={{ fontSize: "10px" }}>
            {data.length > 0 &&
              data[1].map((item, i) => (
                <>
                  {/* Fila principal */}
                  <tr
                    key={i}
                    onClick={() => toggleRow(i, item.MaterialVariableValorId)}
                    style={{ cursor: "pointer" }}>
                    <td>{item.MaterialVariableValorId}</td>
                    <td>{item.Descripcion}</td>
                    <td>{item.componente}</td>
                    <td>{item.materialsegmentoId}</td>
                    <td>{item.valor}</td>
                    <td>{item.costo}</td>
                    <td>{item.CodigoErp}</td>
                    <td>{item.Currency_value}</td>
                    <td>{item.tipo}</td>
                    <td>{item.ID}</td>
                    <td>{item.Marca}</td>
                  </tr>

                  {/* Fila desplegable */}
                  {expandedRow === i && (
                    <tr>
                      <td
                        colSpan="11"
                        style={{ background: "#f9f9f9", padding: "10px" }}>
                        <div className="d-flex">
                          {escalas.map((escalas, index) => {
                            return (
                              <div
                                key={index}
                                className="me-2 border border-2 rounded-2 p-2">
                                <p>
                                  {" "}
                                  <strong>Orden:</strong> {escalas.Orden}
                                </p>
                                {/* <p>si parámetro {escalas.Operador} {escalas.Cota} y tipoCalculo = {escalas.TipoDeCalculo} entonces valor = {escalas.Valor} si tipoCalculo = </p> */}
                                <p style={{ marginTop: "-12px" }}>
                                  {" "}
                                  <strong>Operador:</strong> {escalas.Operador}{" "}
                                </p>
                                <p style={{ marginTop: "-12px" }}>
                                  <strong>Cota:</strong> {escalas.Cota}
                                </p>
                                <p style={{ marginTop: "-12px" }}>
                                  {" "}
                                  <strong>Tipo Cálculo:</strong>{" "}
                                  {escalas.TipoDeCalculo == 1 ? "=" : "*"}
                                </p>
                                <p style={{ marginTop: "-12px" }}>
                                  <strong>Valor:</strong> {escalas.Valor}
                                </p>
                                <input
                                  type="text"
                                  style={{
                                    width: "50px",
                                    borderRadius: "3px",
                                    border: "none",
                                  }}
                                  placeholder="parametro"
                                  value={parametros[index] || ""}
                                  onChange={(e) =>
                                    handleInputChange(
                                      index,
                                      e.target.value,
                                      escalas.MaterialVariableValorId
                                    )
                                  }
                                />

                                <button
                                  style={{
                                    border: "none",
                                    backgroundColor: "#3b8d51",
                                    color: "#fff",
                                    borderRadius: "5px",
                                  }}
                                  onClick={() => handleProbarClick(index)}>
                                  probar
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
          </tbody>
        </table>
      </Row>
    </div>
  );
}

export default Componentes;
