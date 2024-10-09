import React from "react";
import { useForm } from "react-hook-form";
import { Form, Button, Col, Row } from "react-bootstrap";
import { useState } from "react";
import axios from "../api/axios";

function Skus() {
  const { handleSubmit, register, setValue } = useForm();
  let [textAreaValue, setTextAreaValue] = useState([]);
  let [cargando, setCargando] = useState(false);

  const onSubmit = async (values) => {
    setCargando(true);
    let ids = [];
    const data = JSON.parse(values.data);

    if (values.api == "") alert("Selecciona una opción chele");

    if (values.api == "1") {
        for (let i = 0; i < codigo.length; i++) {

            try {
                json.Descripcion = descripcion[i];
                json.Codigo = codigo[i];
                const resp = await axios.post('https://personasapi.vesta-accelerate.com/api/SkuInboundCliente/Create', json);
                if (resp.data.IsValid && resp.data.Message == 'Este codigo ya existe para este Cliente') {
                    arrayExistentes.push({ sku: codigo[i], descripcion: descripcion[i] })
                    continue;
                } else {
                    array.push({ sku: codigo[i], descripcion: descripcion[i] })
                }
    
            } catch (error) {
                console.log('error al agregar sku' + sku)
            }
        }
    }

    if (values.api == "2") {
        for (let json of data) {
            try {
              console.log(json);
              const response = await axios.post("https://analisisderedapi.vesta-accelerate.com/api/ParametroRequeridoCrudApi/CrearParametroTipoSolicitud",json);
              ids.push({"Id" : `${response.data.Message.Id}`, "Valor": `${json.ValorDefecto}`});
              console.log(response.data);
            } catch (error) {
              console.log(error);
            }
          }
    }
    setTextAreaValue(ids);
    setCargando(false);
  };

  return (
    <div className="d-flex w-50 flex-wrap m-auto mt-2">
      <div style={{ width: "100%" }}>
        <Form
          onSubmit={handleSubmit(onSubmit)}
          className="border border-1 p-2 rounded">
          <Row>
            <Col>
              <select className="w-100 mb-2" {...register("api")}>
                <option value="">Selecciona</option>
                <option value="1">SkuInboundCliente</option>
                <option value="4">SkuProveedor</option>
                <option value="3">SkuOutboundCliente</option>
              </select>
            </Col>
          </Row>

          <Row className="d-flex flex-wrap justify-content-between">
            <Col>
              <textarea
                defaultValue={"[]"}
                style={{ width: "100%", height: "500px" }}
                {...register("data", { required: true })}></textarea>
            </Col>
            <Col>
                {cargando && <p>Espera...</p>}
                <table>
                    <tr>
                        <th>Nombre</th>
                        <th>Id</th>
                    </tr>
                    <tbody>
                        {textAreaValue.map((value, index) => {
                            return <tr key={index}>
                                <td>{value.Valor}</td>
                                <td>{value.Id}</td>
                            </tr>;
                        })}
                    </tbody>
                </table>
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
                type="submit"
                className="w-100"
                onClick={() => {
                  setValue("data", "[]");
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

export default Skus;
