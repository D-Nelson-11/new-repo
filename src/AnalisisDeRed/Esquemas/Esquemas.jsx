import { useForm } from "react-hook-form";
import { Form, Button } from "react-bootstrap";
import { useState } from "react";
import jsonAmatillo from "./JSON/amatillo.json";
import jsonPtoCortes from "./JSON/PuertoCortes.json";
import jsonCorinto from "./JSON/Corinto.json";
import jsonGuasaule from "./JSON/Guasaule.json";
import jsonLasManos from "./JSON/LasManos.json";
// import jsonLaMesa from "./JSON/LaMesa.json";
import jsonElPoy from "./JSON/ElPoy.json";
import jsonElflorido from "./JSON/FloridoHn.json";
import jsonPalmerola from "./JSON/Palmerola.json";
import jsonCastilla from "./JSON/puertoCastilla.json";
import ClientesSelect from "../../components/ClientesSelect";
import jsonToncontin from "./JSON/Toncontin_LaMesa.json";
import jsonHenecan from "./JSON/Henecan.json";
import diex from "./JSON/diex.json";
// import jsonToncontin from "./JSON/Toncontin.json";
import generales from "./JSON/generales.json";
import axios from "../../api/axios";
import { colors } from "../../theme/colors";

function Esquemas() {
  const { handleSubmit, register, setValue, getValues } = useForm();
  const [EsquemaAmatillo, setEsquemaAmatillo] = useState(jsonAmatillo);
  const [EsquemaCorinto, setEsquemaCorinto] = useState(jsonCorinto);
  const [EsquemaElPoy, setEsquemaElPoy] = useState(jsonElPoy);
  const [EsquemaFlorido, setEsquemaFlorido] = useState(jsonElflorido);
  const [EsquemaGuasaule, setEsquemaGuasaule] = useState(jsonGuasaule);
  const [EsquemaLasManos, setEsquemaLasManos] = useState(jsonLasManos);
  const [EsquemaPalmerola, setEsquemaPalmerola] = useState(jsonPalmerola);
  const [EsquemaCortes, setEsquemaCortes] = useState(jsonPtoCortes);
  const [EsquemaCastilla, setEsquemaCastilla] = useState(jsonCastilla);
  const [EsquemaToncontin, setEsquemaToncontin] = useState(jsonToncontin);
  const [EsquemaGenerales, setEsquemaGenerales] = useState(generales);
  const [EsquemaHenecan, setEsquemaHenecan] = useState(jsonHenecan);
  const [EsquemaDiex, setEsquemaDiex] = useState(diex);
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
    } else if (values.esquemaNombre == 2) {
      const updatedEsquemaCorinto = { ...EsquemaCorinto };
      updatedEsquemaCorinto.Esquemas.forEach((esquema) => {
        esquema.ClienteId = values.IdCliente.split(",")[0];
        esquema.SitioPorRutaId = values.SitioXRuta;
        esquema.ClienteNombre = values.IdCliente.split(",")[1];
        esquema.UsuarioId = values.IdUsuario;
      });
      setTextAreaValue(JSON.stringify(updatedEsquemaCorinto, null, 2));
    } else if (values.esquemaNombre == 3) {
      const updatedEsquemaElPoy = { ...EsquemaElPoy };
      updatedEsquemaElPoy.Esquemas.forEach((esquema) => {
        esquema.ClienteId = values.IdCliente.split(",")[0];
        esquema.SitioPorRutaId = values.SitioXRuta;
        esquema.ClienteNombre = values.IdCliente.split(",")[1];
        esquema.UsuarioId = values.IdUsuario;
      });
      setTextAreaValue(JSON.stringify(updatedEsquemaElPoy, null, 2));
    } else if (values.esquemaNombre == 4) {
      const updatedEsquemaFlorido = { ...EsquemaFlorido };
      updatedEsquemaFlorido.Esquemas.forEach((esquema) => {
        esquema.ClienteId = values.IdCliente.split(",")[0];
        esquema.SitioPorRutaId = values.SitioXRuta;
        esquema.ClienteNombre = values.IdCliente.split(",")[1];
        esquema.UsuarioId = values.IdUsuario;
      });
      setTextAreaValue(JSON.stringify(updatedEsquemaFlorido, null, 2));
    } else if (values.esquemaNombre == 5) {
      const updatedEsquemaGuasaule = { ...EsquemaGuasaule };
      updatedEsquemaGuasaule.Esquemas.forEach((esquema) => {
        esquema.ClienteId = values.IdCliente.split(",")[0];
        esquema.SitioPorRutaId = values.SitioXRuta;
        esquema.ClienteNombre = values.IdCliente.split(",")[1];
        esquema.UsuarioId = values.IdUsuario;
      });
      setTextAreaValue(JSON.stringify(updatedEsquemaGuasaule, null, 2));
    } else if (values.esquemaNombre == 6) {
      const updatedEsquemaLasManos = { ...EsquemaLasManos };
      updatedEsquemaLasManos.Esquemas.forEach((esquema) => {
        esquema.ClienteId = values.IdCliente.split(",")[0];
        esquema.SitioPorRutaId = values.SitioXRuta;
        esquema.ClienteNombre = values.IdCliente.split(",")[1];
        esquema.UsuarioId = values.IdUsuario;
      });
      setTextAreaValue(JSON.stringify(updatedEsquemaLasManos, null, 2));
    } else if (values.esquemaNombre == 7) {
      const updatedEsquemaPalmerola = { ...EsquemaPalmerola };
      updatedEsquemaPalmerola.Esquemas.forEach((esquema) => {
        esquema.ClienteId = values.IdCliente.split(",")[0];
        esquema.SitioPorRutaId = values.SitioXRuta;
        esquema.ClienteNombre = values.IdCliente.split(",")[1];
        esquema.UsuarioId = values.IdUsuario;
      });
      setTextAreaValue(JSON.stringify(updatedEsquemaPalmerola, null, 2));
    } else if (values.esquemaNombre == 8) {
      const updatedEsquemaCastilla = { ...EsquemaCastilla };
      updatedEsquemaCastilla.Esquemas.forEach((esquema) => {
        esquema.ClienteId = values.IdCliente.split(",")[0];
        esquema.SitioPorRutaId = values.SitioXRuta;
        esquema.ClienteNombre = values.IdCliente.split(",")[1];
        esquema.UsuarioId = values.IdUsuario;
      });
      setTextAreaValue(JSON.stringify(updatedEsquemaCastilla, null, 2));
    } else if (values.esquemaNombre == 9) {
      const updatedEsquemaGenerales = { ...EsquemaGenerales };
      updatedEsquemaGenerales.Esquemas.forEach((esquema) => {
        esquema.ClienteId = values.IdCliente.split(",")[0];
        esquema.SitioPorRutaId = values.SitioXRuta;
        esquema.ClienteNombre = values.IdCliente.split(",")[1];
        esquema.UsuarioId = values.IdUsuario;
      });
      setTextAreaValue(JSON.stringify(updatedEsquemaGenerales, null, 2));
    } else if (values.esquemaNombre == 10) {
      const updatedEsquemaCortes = { ...EsquemaCortes };
      updatedEsquemaCortes.Esquemas.forEach((esquema) => {
        esquema.ClienteId = values.IdCliente.split(",")[0];
        esquema.SitioPorRutaId = values.SitioXRuta;
        esquema.ClienteNombre = values.IdCliente.split(",")[1];
        esquema.UsuarioId = values.IdUsuario;
      });
      setTextAreaValue(JSON.stringify(updatedEsquemaCortes, null, 2));
    } else if (values.esquemaNombre == 11) {
      const updatedEsquemaToncontin = { ...EsquemaToncontin };
      updatedEsquemaToncontin.Esquemas.forEach((esquema) => {
        esquema.ClienteId = values.IdCliente.split(",")[0];
        esquema.SitioPorRutaId = values.SitioXRuta;
        esquema.ClienteNombre = values.IdCliente.split(",")[1];
        esquema.UsuarioId = values.IdUsuario;
      });
      setTextAreaValue(JSON.stringify(updatedEsquemaToncontin, null, 2));
    } else if (values.esquemaNombre == 12) {
      const updatedEsquemaHenecan = { ...EsquemaHenecan };
      updatedEsquemaHenecan.Esquemas.forEach((esquema) => {
        esquema.ClienteId = values.IdCliente.split(",")[0];
        esquema.SitioPorRutaId = values.SitioXRuta;
        esquema.ClienteNombre = values.IdCliente.split(",")[1];
        esquema.UsuarioId = values.IdUsuario;
      });
      setTextAreaValue(JSON.stringify(updatedEsquemaHenecan, null, 2));
    } else if (values.esquemaNombre == 13) {
      const updatedEsquemaDiex = { ...EsquemaDiex };
      updatedEsquemaDiex.Esquemas.forEach((esquema) => {
        esquema.ClienteId = values.IdCliente.split(",")[0];
        esquema.SitioPorRutaId = values.SitioXRuta;
        esquema.ClienteNombre = values.IdCliente.split(",")[1];
        esquema.UsuarioId = values.IdUsuario;
      });
      setTextAreaValue(JSON.stringify(updatedEsquemaDiex, null, 2));
    }
  };

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
              <option value="1">Amatillo </option>
              <option value="2">Corinto</option>
              <option value="3">El Poy</option>
              <option value="4">El Florido</option>
              <option value="5">Guasaule</option>
              <option value="6">Las Manos</option>
              <option value="7">Palmerola</option>
              <option value="8">Puerto Castilla</option>
              <option value="9">Generales</option>
              <option value="10">Puerto Cortes</option>
              <option value="11">Toncontin - La Mesa</option>
              <option value="12">Henecan(San Lorenzo)</option>
              <option value="13">Diex</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>RutaId</Form.Label>
            <div className="d-flex gap-1">
              <Form.Control
                type="text"
                placeholder=""
                {...register("RutaId", { required: true })}
                style={{ width: "65%" }}
              />
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
                style={{
                  width: "45%",
                  backgroundColor: colors.colorAzulGeneral,
                  border: "none",
                }}>
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
              <option value="">-Selecione-</option>
              <option value="D7CCF64B-4700-4FF7-B0A7-246A08B41246">
                Gabriela
              </option>
              <option value="C183E6D0-6855-4613-A85D-24F1E30E165E">
                Fredy
              </option>
              <option value="0C3A7B92-34D7-453A-883F-24C15B24FF6A">
                David
              </option>
              <option value="3EF3F051-7D5D-436A-8118-22AFD860662B">Dany</option>
              <option value="F92928DC-1CDA-436C-8ECE-254FC151469C">
                Sandra
              </option>
            </Form.Select>
          </Form.Group>
          <Button
            style={{ backgroundColor: colors.colorAzulGeneral, border: "none" }}
            className="w-100"
            type="submit">
            Generar
          </Button>
          <Button
            className="mt-1 w-100 bg-success border-0"
            onClick={async () => {
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
