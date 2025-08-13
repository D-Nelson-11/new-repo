import { useState, useEffect } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { colors } from "../theme/colors";
import { useForm } from "react-hook-form";
import axios from "axios";
import {toast} from "sonner";

const Mediciones = () => {
  const { register, handleSubmit } = useForm();
  const [nombreDeLaRuta, setNombreDeLaRuta] = useState();
  const [sitiosDeLaRuta, setSitiosDeLaRuta] = useState();

  const onSubmit = async (data) => {
      let confirmarSubmit = confirm("¿Enviar?");
  if (!confirmarSubmit) return;
  const proceso = async () => {
    let sitiosRutaMadre = 0;
    let sitiosRutaHija = 0;
    let esquemas = [];
    let sitioConEsquemas = 0;
    let nombreRutaMadre = "";

    const datosRuta = await axios.post(
      "https://analisisderedapi.vesta-accelerate.com/api/RutaCrudApi/GetRutaById",
      { Id: data.ruta }
    );
    if (data.sellosAforo) {
      data.sellosAforo = "true";
    }

    sitiosRutaMadre = datosRuta.data.Message.SitiosPorRuta.length;
    nombreRutaMadre = datosRuta.data.Message.NombreRuta;
    setNombreDeLaRuta(nombreRutaMadre);
    setSitiosDeLaRuta(sitiosRutaMadre);

    for (let i = 0; i < datosRuta.data.Message.SitiosPorRuta.length; i++) {
      if (datosRuta.data.Message.SitiosPorRuta[i].Esquemas.length > 0) {//Si uno de esos sitio tiene esquemas
        sitioConEsquemas = datosRuta.data.Message.SitiosPorRuta[i].Orden;
        for (let j = 0; j < datosRuta.data.Message.SitiosPorRuta[i].Esquemas.length; j++) {
          if (datosRuta.data.Message.SitiosPorRuta[i].Esquemas[j].Requerido) {
            let perro = await axios.get(
              `https://seguimientoapi.vesta-accelerate.com/api/EsquemaFlujo/Details/${datosRuta.data.Message.SitiosPorRuta[i].Esquemas[j].EsquemaId}`
            );
            for (let k = 0; k < perro.data.Message.EsquemaFlujoDetalles.length; k++) {
              esquemas.push(perro.data.Message.EsquemaFlujoDetalles[k].EtiquetaDescripcion);
            }
          }
        }
      }
    }
    if (esquemas.length == 0) {

      return new Error("NO SEA PENDEJO PERRO, no hay esquemas");
    }

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
        body: new URLSearchParams({
          ...data,
          sitiosRutaMadre,
          sitiosRutaHija,
          nombreRutaMadre,
          esquemas,
          sitioConEsquemas,
        }),
      }
    );

    const result = await res.json();
    return result.mensaje; // texto para el toast de éxito
  };

  toast.promise(proceso(), {
    loading: "Enviando... revisa el excel chele",
    success: (mensaje) => `${mensaje}`,
    error: (err) => `${err.message}`,
  });
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
        {nombreDeLaRuta && (
          <div className="mt-3">
            <p> <strong>Ruta:</strong> {nombreDeLaRuta}</p>
            <p><strong>Cantidad sitios:</strong> {sitiosDeLaRuta}</p>
          </div>
        )}
      </Form>
    </Container>
  );
};

export default Mediciones;
