import React from "react";
import { set, useForm } from "react-hook-form";
import { Form, Button, Col, Row } from "react-bootstrap";
import { useState } from "react";
import {
  grupoPersona,
  TipoRelacion,
  CatalogoRelacion,
  PersonaNaturalColaborador,
  ClienteProveedor,
  RelacionService,
} from "./jsons";
import axios from "../../api/axios";

function Intransit() {
  const { handleSubmit, register, setValue } = useForm();
  let [textAreaValue, setTextAreaValue] = useState("");
  let [stage, setStage] = useState(0);
  let [disabled , setDisabled] = useState(false);

  const onSubmit = async (values) => {
    setDisabled(true);
    let IdsTipoRelacion = [];
    let IdsPersonasColab = [];
    let index = 0;
    let ParsedRespGp = "";
    if (stage == 0) {
      const conf = confirm("TODO SE HARÁ EN STAGE, ESTAS SEGURO?");
      if (!conf) {
        console.log("no voy a hacer nada");
        return;
      }
    } else {
      const conf = confirm("TODO SE HARÁ EN PRODUCCIÓN, ESTAS SEGURO?");
      if (!conf) {
        console.log("no voy a hacer nada");
        return;
      }
    }

    // --------------------------------GRUPO PERSONA PASO 1--------------------------------
    grupoPersona.Descripcion = `GRUPO ${values.nombreProveedor}`;
    let resp;
    if (stage == 0) {
      resp = await axios.post("https://personasws.vestadev-accelerate.com/api/GrupoRelacionCrudApi/Create",grupoPersona);
    } else {
      resp = await axios.post("https://personasapi.vesta-accelerate.com/api/GrupoRelacionCrudApi/Create",grupoPersona);
    }
    ParsedRespGp = JSON.parse(resp.data.Message);
    console.log("PASO 1 DE 5 EXITOSO ✔");

  //   // --------------------------------TIPO RELACION PASO 2--------------------------------
    for (let tr of TipoRelacion) {
      tr.GrupoRelacionId = ParsedRespGp.Id;
      tr.GrupoRelacionDescripcion = `GRUPO ${values.nombreProveedor}`;
      if (stage == 0) {
        try {
          let resp = await axios.post("https://personasws.vestadev-accelerate.com/api/TipoRelacionCrudApi/Create",tr);
          const parsedRespTr = JSON.parse(resp.data.Message);
          console.log(`hice el post de TipoRelacion: ${tr.Descripcion} su Id: ${parsedRespTr.Id}`);
          IdsTipoRelacion.push(parsedRespTr.Id);
        } catch (error) {
          console.log('no pude hacer el post de TipoRelacion: ' + tr.Descripcion + ' ' + error);
          return;
        }
      } else {
        try {
          let resp = await axios.post("https://personasapi.vesta-accelerate.com/api/TipoRelacionCrudApi/Create",tr);
          console.log("hice el post de TipoRelacion: " + tr.Descripcion);
          const parsedRespTr = JSON.parse(resp.data.Message);
          console.log(`hice el post de TipoRelacion: ${tr.Descripcion} su Id: ${parsedRespTr.Id}`);
          IdsTipoRelacion.push(parsedRespTr.Id);
        } catch (error) {
          console.log('no pude hacer el post de TipoRelacion: ' + tr.Descripcion + ' ' + error);
          return;
        }
      }
    }
    console.log('PASO 2 DE 5 EXITOSO ✔');
  //   // --------------------------------CATALOGO RELACION PASO 3--------------------------------
    for (let i = 0; i < IdsTipoRelacion.length; i++) {
      CatalogoRelacion[i].PersonaId = values.ProveedorId;
      CatalogoRelacion[i].TipoRelacionId = IdsTipoRelacion[i];
      if (stage == 0) {
        console.log(CatalogoRelacion[i]);
        try{
          await axios.post("https://personasws.vestadev-accelerate.com/api/CatalogoRelacionServiceApi/Create",CatalogoRelacion[i]);
        }catch(error){
          console.log('no pude hacer el post de CatalogoRelacion: '+ CatalogoRelacion[i].TipoRelacionDescripcion + ' ' +  error);
          return;
        }
      } else {
        try {
          await axios.post("https://personasapi.vesta-accelerate.com/api/CatalogoRelacionServiceApi/Create",CatalogoRelacion[i]);
        } catch (error) {
          console.log('no pude hacer el post de CatalogoRelacion: ' + CatalogoRelacion[i].TipoRelacionDescripcion + ' ' + error);
          return;
        }
       
      }
      console.log("hice el post de CatalogoRelacion: " + CatalogoRelacion[i].TipoRelacionDescripcion);
    }
    console.log('PASO 3 DE 5 EXITOSO ✔');

  //   // --------------------------------PERSONA NATURAL COLABORADOR PASO 4--------------------------------
    for (let pnc of PersonaNaturalColaborador) {
      const date = new Date();
      const formattedDate = date.toISOString().slice(0, 10).replace(/-/g, "");
      const seconds = date.getSeconds().toString().padStart(2, "0");
      const result = formattedDate + seconds;

      pnc.IdFiscal = result + values.nombreProveedor[0] + values.ProveedorId.slice(0,4); //inventar
      pnc.GrupoPersonaId = values.GrupoPersonaId;
      pnc.GrupoPersonaNombre = values.GrupoPersonaNombre;
      pnc.SitioProveedorId = values.SitioPersonaProveedorId;
      pnc.NombreUsuario = pnc.Nombre + ` ${values.nombreProveedor}`; //inventar
      pnc.Nombre = (pnc.Nombre + ` ${values.nombreProveedor}`).toUpperCase();
      if (stage == 0) {
        try {
          resp = await axios.post("https://personasws.vestadev-accelerate.com/api/PersonaNaturalColaboradorApi/Create",pnc);
        } catch (error) {
          console.log('no pude hacer el post de PersonaNaturalColaborador: ' + pnc.Nombre + ' ' + error);
          return;
        }
      } else {
        try {
          resp = await axios.post("https://personasapi.vesta-accelerate.com/api/PersonaNaturalColaboradorApi/Create",pnc);
        } catch (error) {
          console.log('no pude hacer el post de PersonaNaturalColaborador: ' + pnc.Nombre + ' ' + error);
          return;          
        }
      }
      const parsedRespTr = JSON.parse(resp.data.Message);
      IdsPersonasColab.push(parsedRespTr.Id);
      console.log('hice el post de PersonaNaturalColaborador: ' + pnc.Nombre + 'Id:' + parsedRespTr.Id);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    console.log('PASO 4 DE 5 EXITOSO ✔');

  // //   // --------------------------------RELACIÓN SERVICE PASO 5--------------------------------
    for (let relacion of RelacionService) {
      if (index == 0) {
        relacion.CatalogoRelacionPersonaId = values.ProveedorId;
        relacion.CatalogoRelacionTipoRelacionId = IdsTipoRelacion[0];
        relacion.PersonaId = values.ClienteId;
      } else {
        relacion.CatalogoRelacionPersonaId = values.ProveedorId;
        relacion.PersonaId = IdsPersonasColab[index - 1];
        relacion.CatalogoRelacionTipoRelacionId = IdsTipoRelacion[1];
      }
      console.log(relacion);
      if (stage == 0) {
        try {
          await axios.post("https://personasws.vestadev-accelerate.com/api/RelacionServiceApi/Create",relacion);
        } catch (error) {
          console.log('no pude hacer el post de RelacionService: ' + (index+1) + ' ' + error);
          return;
        }
      } else {
        try {
          await axios.post("https://personasapi.vesta-accelerate.com/api/RelacionServiceApi/Create",relacion);
        } catch (error) {
          console.log('no pude hacer el post de RelacionService: ' + (index+1) + ' ' + error);
          return;
        }
      }
      console.log('hice el post de RelacionService de la persona: ' + (index+1));
      index++;
    }
    console.log('PASO 5 DE 5 EXITOSO ✔');
    setTextAreaValue("TODO CHEQUE CHELE ✔");
    setDisabled(false);
  };

  return (
    <div className="d-flex w-50 flex-wrap m-auto mt-5">
      <div style={{ width: "100%" }}>
        <Form onSubmit={handleSubmit(onSubmit)} className="border border-1 p-2 rounded">
          <Row>
            <Col>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1">
                <Form.Label>Base de Datos</Form.Label>
                <Form.Select
                  onChange={(e) => {
                    setStage(e.target.value);
                  }}>
                  <option value={0}>stage</option>
                  <option value={1}>produccion</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1">
                <Form.Label>Nombre Proveedor</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nombre del Proveedor"
                  {...register("nombreProveedor", { required: true })}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1">
                <Form.Label>Proveedor Id</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Proveedor Id"
                  {...register("ProveedorId", { required: true })}
                />
              </Form.Group>
            </Col>

            <Col>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1">
                <Form.Label>SitioPersonaProveedor</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="sitio persona del proveedor"
                  {...register("SitioPersonaProveedorId", { required: true })}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1">
                <Form.Label>Cliente Id</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Cliente Id"
                  {...register("ClienteId", { required: true })}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1">
                <Form.Label>GrupoPersonaId</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="GrupoPersonaId"
                  {...register("GrupoPersonaId", { required: true })}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1">
                <Form.Label>GrupoPersonaNombre</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Grupo Persona Nombre"
                  {...register("GrupoPersonaNombre", { required: true })}
                />
              </Form.Group>
            </Col>
          </Row>
          <Button type="submit" className="w-100" disabled={disabled}>
            Generar
          </Button>
        </Form>
      </div>
      <div style={{ width: "100%" }}>
        <textarea
          value={textAreaValue}
          style={{ width: "100%", height: "100%", color:"#fff"}} className="bg-dark"></textarea>
      </div>
    </div>
  );
}

export default Intransit;
