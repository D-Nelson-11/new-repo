import { useState, useEffect } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { colors } from "../theme/colors";
import { useForm } from "react-hook-form";
import axios from "axios";

const Mediciones = () => {
  const [rutaId, setRutaId] = useState("");
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      let sitiosRutaMadre = 0;
      let sitiosRutaHija = 0;
      let esquemas =[];
      let sitioConEsquemas = 0;
      let nombreRutaMadre="";
      const datosRuta = await axios.post(
        "https://analisisderedapi.vesta-accelerate.com/api/RutaCrudApi/GetRutaById",
        { Id: data.ruta }
      );
      console.log(datosRuta.data.Message);

      // const perros = await axios.get("https://seguimientoapi.vesta-accelerate.com/api/EsquemaFlujo/Details/be237a0f-39ae-4aa2-a54a-164158601631");
      // console.log(perros);
      // return;
      sitiosRutaMadre = datosRuta.data.Message.SitiosPorRuta.length;
      nombreRutaMadre = datosRuta.data.Message.NombreRuta;

      for (let i = 0; i < datosRuta.data.Message.SitiosPorRuta.length; i++) { //recorro el array de sitiosPorRuta
        if (datosRuta.data.Message.SitiosPorRuta[i].Esquemas.length > 0) {//Si uno de esos sitio tiene esquemas, 
          sitioConEsquemas = datosRuta.data.Message.SitiosPorRuta[i].Orden;
          for (let j = 0; j < datosRuta.data.Message.SitiosPorRuta[i].Esquemas.length; j++) { //los recorro 
            if (datosRuta.data.Message.SitiosPorRuta[i].Esquemas[j].Requerido) { //Si el esquema es requerido, lo guardo
              let perro = await axios.get(`https://seguimientoapi.vesta-accelerate.com/api/EsquemaFlujo/Details/${datosRuta.data.Message.SitiosPorRuta[i].Esquemas[j].EsquemaId}`);
                for (let k = 0; k < perro.data.Message.EsquemaFlujoDetalles.length; k++){
                  esquemas.push(perro.data.Message.EsquemaFlujoDetalles[k].EtiquetaDescripcion);
                }
            }
          }
        }
      }
      console.log(esquemas);

      if (datosRuta.data.Message.RutaCompuesta.length > 0) {
        sitiosRutaHija = datosRuta.data.Message.RutaCompuesta[0].SitiosPorRuta.length;
      }

      const res = await fetch(
        "https://script.google.com/macros/s/AKfycbwIxtcFDJ64ffHjZOmrM4gXvaOrz8fKRopj5MZaJM1j8OnxgF642prcSZKKtY4P6K1YGA/exec",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({...data, sitiosRutaMadre, sitiosRutaHija, nombreRutaMadre, esquemas, sitioConEsquemas }),
        }
      );

      const result = await res.json();
      alert("Formulario enviado: " + result.mensaje);
    } catch (error) {
      alert("Error al enviar: " + error.message);
      console.error("Error al enviar el formulario:", error);
    }
  };

  return (
    <Container className="mt-4">
      <Form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded p-4 shadow">
        <Form.Group controlId="formRutaId">
          <Form.Label>RutaId</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ruta Id"
            {...register("ruta", { required: true })}
          />
        </Form.Group>
        <Form.Group controlId="formCheck">
          <Form.Check
            type="checkbox"
            label="Sellos de aforo"
            {...register("sellosAforo")}
          />
        </Form.Group>

        <Button
          style={{ backgroundColor: colors.colorAzulGeneral, border: "none" }}
          type="submit"
          className="mt-3">
          Enviar
        </Button>
      </Form>
    </Container>
  );
};

export default Mediciones;
