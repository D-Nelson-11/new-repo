import { useForm } from "react-hook-form";
import { Form, Button } from "react-bootstrap";
import { useState } from "react";
import jsonAmatillo from "./JSON/amatillo.json";
import jsonPtoCortes from "./JSON/PuertoCortes.json";
import jsonLaMesa from "./JSON/LaMesa.json";
import jsonElPoy from "./JSON/ElPoy.json";
import jsonCastilla from "./JSON/puertoCastilla.json";
import ClientesSelect from "../../components/ClientesSelect";
import jsonToncontin from "./JSON/Toncontin.json";
import generales from  "./JSON/generales.json";
import axios from "../../api/axios";
import { colors } from "../../theme/colors";

function Esquemas() {
  const { handleSubmit, register, setValue, getValues } = useForm();
  const [EsquemaAmatillo, setEsquemaAmatillo] = useState(jsonAmatillo);
  const [EsquemaCortes, setEsquemaCortes] = useState(jsonPtoCortes);
  const [EsquemaLaMesa, setEsquemaLaMesa] = useState(jsonLaMesa);
  const [EsquemaElPoy, setEsquemaElPoy] = useState(jsonElPoy);
  const [EsquemaCastilla, setEsquemaCastilla] = useState(jsonCastilla);
  const [EsquemaToncontin, setEsquemaToncontin] = useState(jsonToncontin);
  const [EsquemaGenerales, setEsquemaGenerales] = useState(generales);
  const [sitiosPorRuta, setSitiosPorRuta] = useState([]);

  const [textAreaValue, setTextAreaValue] = useState("");

  const onSubmit = (values) => {
    if (values.esquemaNombre == 1) {
      const updatedEsquemaAmatillo = { ...EsquemaAmatillo };
      updatedEsquemaAmatillo.Esquemas.forEach((esquema) => {
        esquema.ClienteId = values.IdCliente.split(",")[0];
        esquema.SitioPorRutaId = values.SitioXRuta;
        esquema.ClienteNombre = values.IdCliente.split(",")[1];
        esquema.UsuarioId = values.IdUsuario;
      });

      setTextAreaValue(JSON.stringify(updatedEsquemaAmatillo, null, 2));
    } else if (values.esquemaNombre == 3) {
      const updatedEsquemaCortes = { ...EsquemaCortes };
      updatedEsquemaCortes.Esquemas.forEach((esquema) => {
        esquema.ClienteId = values.IdCliente.split(",")[0];
        esquema.SitioPorRutaId = values.SitioXRuta;
        esquema.ClienteNombre = values.IdCliente.split(",")[1];
        esquema.UsuarioId = values.IdUsuario;
      });

      setTextAreaValue(JSON.stringify(updatedEsquemaCortes, null, 2));
    } else if (values.esquemaNombre == 4) {
      const updatedEsquemaLaMesa = { ...EsquemaLaMesa };
      updatedEsquemaLaMesa.Esquemas.forEach((esquema) => {
        esquema.ClienteId = values.IdCliente.split(",")[0];
        esquema.SitioPorRutaId = values.SitioXRuta;
        esquema.ClienteNombre = values.IdCliente.split(",")[1];
        esquema.UsuarioId = values.IdUsuario;
      });

      setTextAreaValue(JSON.stringify(updatedEsquemaLaMesa, null, 2));
    } else if (values.esquemaNombre == 5) {
      const updatedEsquemaElPoy = { ...EsquemaElPoy };
      updatedEsquemaElPoy.Esquemas.forEach((esquema) => {
        esquema.ClienteId = values.IdCliente.split(",")[0];
        esquema.SitioPorRutaId = values.SitioXRuta;
        esquema.ClienteNombre = values.IdCliente.split(",")[1];
        esquema.UsuarioId = values.IdUsuario;
      });

      setTextAreaValue(JSON.stringify(updatedEsquemaElPoy, null, 2));
    } else if (values.esquemaNombre == 2) {
      const updatedEsquemaCastilla = { ...EsquemaCastilla };
      updatedEsquemaCastilla.Esquemas.forEach((esquema) => {
        esquema.ClienteId = values.IdCliente.split(",")[0];
        esquema.SitioPorRutaId = values.SitioXRuta;
        esquema.ClienteNombre = values.IdCliente.split(",")[1];
        esquema.UsuarioId = values.IdUsuario;
      });

      setTextAreaValue(JSON.stringify(updatedEsquemaCastilla, null, 2));
    } else if (values.esquemaNombre == 6) {
      const updatedEsquemaToncontin = { ...EsquemaToncontin };
      updatedEsquemaToncontin.Esquemas.forEach((esquema) => {
        esquema.ClienteId = values.IdCliente.split(",")[0];
        esquema.SitioPorRutaId = values.SitioXRuta;
        esquema.ClienteNombre = values.IdCliente.split(",")[1];
        esquema.UsuarioId = values.IdUsuario;
      });

      setTextAreaValue(JSON.stringify(updatedEsquemaToncontin, null, 2));
    } else if (values.esquemaNombre == 7) {
      const updatedEsquemaGenerales = { ...EsquemaGenerales };
      updatedEsquemaGenerales.Esquemas.forEach((esquema) => {
        esquema.ClienteId = values.IdCliente.split(",")[0];
        esquema.SitioPorRutaId = values.SitioXRuta;
        esquema.ClienteNombre = values.IdCliente.split(",")[1];
        esquema.UsuarioId = values.IdUsuario;
      });

      setTextAreaValue(JSON.stringify(updatedEsquemaGenerales, null, 2));
    }
  };

  function handleIsLoading(isLoading) {
    setIsloading(isLoading);
  }

  return (
    <div className="d-flex w-100 justify-content-between">
      <div style={{ width: "33%" }}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Esquema</Form.Label>
            <Form.Select
              aria-label="Default select example"
              {...register("esquemaNombre", { required: true })}>
              <option value="">--Seleccione--</option>
              <option value="1">
                El Florido/Amatillo/Las Manos/Corinto/Agua Caliente
              </option>
              <option value="2">Puerto Castilla</option>
              <option value="3">Puerto Cortés</option>
              <option value="4">La Mesa</option>
              <option value="5">El Poy</option>
              <option value="6">Toncontin</option>
              <option value="7">Generales</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>RutaId</Form.Label>
            <div className="d-flex gap-1">
              <Form.Control
                type="text"
                placeholder=""
                {...register("RutaId", { required: true })}
                style={{ width: "65%" }}              />
              <Button
                onClick={async () => {
                  try {
                    const resp = await axios.post(
                      "https://analisisderedapi.vesta-accelerate.com/api/SitioPorRutaCrudApi/Index",
                      { RutaId: getValues("RutaId") }
                    );
                    console.log(resp.data);
                    setSitiosPorRuta(resp.data.Message);
                  } catch (error) {
                    console.error(error);
                    alert("errror chele");
                  }
                }}
                style={{ width: "45%", backgroundColor: colors.colorAzulGeneral, border:"none"}}>
                Buscar Sitios
              </Button>
            </div>
          </Form.Group>

          {sitiosPorRuta.length > 0 && (
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Sitios</Form.Label>
              <Form.Select {...register("SitioXRuta", { required: true })}>
                {sitiosPorRuta.map((sitio) => (
                  <option key={sitio.Id} value={sitio.Id}>
                    {sitio.SitioNombre}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          )}
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Cliente</Form.Label>
            <ClientesSelect register={register} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Usuario</Form.Label>
            <Form.Select {...register("IdUsuario", { required: true })}>
              <option value="0C3A7B92-34D7-453A-883F-24C15B24FF6A">
                David
              </option>
              <option value="FF921408-E3B9-469B-A7DC-24A2B8D3C4F5">Joel</option>
            </Form.Select>
          </Form.Group>
          <Button style={{ backgroundColor: colors.colorAzulGeneral, border:"none"}} className="w-100" type="submit">
            Generar
          </Button>
          <Button className="mt-1 w-100 bg-success border-0" onClick={async() => {
              let confirmar = confirm("¿Seguro que desea crear el esquema?");
              if (!confirmar) return;
              try {
                const resp = await axios.post(
                  "https://analisisderedapi.vesta-accelerate.com/api/EsquemaCrudApi/CreateMany",
                  JSON.parse(textAreaValue)
                );
                console.log(resp.data);
                alert("Esquemas creados exitosamente");
              } catch (error) {
                console.error(error);
                alert("Error al crear esquemas");
              }

          }}>
            Crear
          </Button>
        </Form>
      </div>

      <div style={{ width: "65%" }}>
        <textarea
          value={textAreaValue}
          style={{ width: "100%", height: "100%" }}></textarea>
      </div>
    </div>
  );
}

export default Esquemas;
