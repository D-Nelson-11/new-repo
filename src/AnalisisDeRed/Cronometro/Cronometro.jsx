import React from "react";
import { useForm } from "react-hook-form";
import { Form, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import infoCronometro from "./Cronometro.json";
import axios from '../../api/axios'
import { saveAs } from 'file-saver';

function Cronometro() {
  const { handleSubmit, register, setValue } = useForm();
  const [textAreaValue, setTextAreaValue] = useState("");
  const [info, setInfo] = useState(infoCronometro);
  const [proveedorId, setProveedorId] = useState("");

  const onSubmit = (values) => {
    let json =  {
        "RutaId": `${values.RutaId}`,
        "ProveedorId": `${values.ProveedorId}`,
        "FacturaVesta": false,
        "Descripcion": "DEMORA",
        "CapacidadCargaId": "e30abb7d-6bcf-47fc-ae06-16408152db78",
        "SitioInicioId": `${values.SitioInicio}`,
        "SitioFinId": `${values.SitioFin}`,
        "TipoSelloInicioId": 1,
        "SelloInicioDescripcion": "",
        "SelloFinDescripcion": "",
        "TipoSelloFinId": 2,
        "CreatedBy": "0C3A7B92-34D7-453A-883F-24C15B24FF6A",
        "ClaseCronometroId": 2,
        "Horas": false,
        "Redondear": true,
        "DiaMasDiaMenos": "+1"
      }
      setTextAreaValue(JSON.stringify(json,null,2));
  };

//   useEffect(() => {
//     console.log(info[0]);
//     info[0].map((element) => {
//       console.log(element.IdProveedor);
//     });
//   }, []);


const exportToExcel = (data) => {
  // Transformar el arreglo en un formato que pueda ser interpretado como una columna
  const dataInColumns = data.map(item => [item]);

  // Crear una nueva hoja de trabajo
  const worksheet = XLSX.utils.aoa_to_sheet(dataInColumns);
  
  // Crear un nuevo libro de trabajo y agregar la hoja de trabajo
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");

  // Generar un archivo Excel y guardarlo
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(blob, 'datos.xlsx');
};

  return (
    <div className="d-flex w-100 justify-content-between">
      <div style={{ width: "33%" }}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Proveedor</Form.Label>
            <Form.Select
              aria-label="Default select example"
              {...register("ProveedorId", { required: true })}>
              {info[0].map((element,i) => {
                return (
                  <option key={i} value={element.IdProveedor}>{element.Nombre}</option>
                );
              })}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Ruta Id</Form.Label>
            <Form.Control
              type="text"
              placeholder=""
              {...register("RutaId", { required: true })}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Sitio Inicio</Form.Label>
            <Form.Select
              aria-label="Default select example"
              {...register("SitioInicio", { required: true })}>
              {info[1].map((element,i) => {
                return (
                  <option key={i} value={element.IdSitioInicio}>{element.Nombre}</option>
                );
              })}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Sitio Fin</Form.Label>
             <Form.Select
              aria-label="Default select example"
              {...register("SitioFin", { required: true })}>
              {info[2].map((element,i) => {
                return (
                  <option key={i} value={element.IdSitioFin}>{element.Nombre}</option>
                );
              })}
            </Form.Select>
          </Form.Group>
          <Button type="submit" className="w-100">
            Generar
          </Button>
          <Button className="w-100 mt-3" variant="success"  onClick={async()=>{
          try {
            const aceptar = confirm('¿Enviar la petición?')
            if (aceptar){
              const resp = await axios.get('http://torrecontrolws.grupovesta.net/api/HotTeamServiceApi/GetSitios',textAreaValue)
              let datos = resp.data.map((item)=>{return item.SitioId})
              exportToExcel(datos)
            }
          } catch (error) {
            alert(error)
          }
          }}>
            Enviar
          </Button>
        </Form>
      </div>

      <div style={{ width: "65%" }}>
        <textarea
          value={textAreaValue}
          readOnly
          style={{ width: "100%", height: "85%" }}></textarea>
      </div>
    </div>
  );
}

export default Cronometro;
