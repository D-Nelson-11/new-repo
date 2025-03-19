import { Form, InputGroup, Button } from "react-bootstrap";
import ModalC from "../../components/ModalC";
import CrearSitios from "./CrearSitios";
import axios from "../../api/axios";
import { useEffect, useState } from "react";
import Segmentos from "../../Persona/Segmentos/Segmentos";
import { TfiReload } from "react-icons/tfi";
import { useForm } from "react-hook-form";
import { FaPlaneDeparture } from "react-icons/fa";

export function RutaSimple({ cantidad, IdCliente }) {
  let [sitiosAduana, setSitiosAduana] = useState([]);
  let [sitiosCliente, setSitiosCliente] = useState([]);
  let [segmentosPorCliente, setSegmentosPorCliente] = useState([]);
  const [tiposSitio, setTiposSitio] = useState({});
  const [sitiosSeleccionados, setSitiosSeleccionados] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSitios, setFilteredSitios] = useState([]);
  const { register, getValues, handleSubmit } = useForm();
  let datosFormulario = {};

  const handleTipoSitioChange = (index, value) => {
    setTiposSitio((prev) => {
      const newTiposSitio = { ...prev, [index]: value };
      if (value !== "Aduana") {
        newTiposSitio[`searchTerm_${index}`] = "";
        newTiposSitio[`filteredSitios_${index}`] = [];
      }
      return newTiposSitio;
    });
  };

  const handleSearchChange = (e, i) => {
    const value = e.target.value;
    setSearchTerm(value);

    let filtered;
    if (tiposSitio[i] === "Aduana") {
      filtered = sitiosAduana.filter((sitio) =>
        sitio.Nombre.toLowerCase().includes(value.toLowerCase())
      );
    } else if (tiposSitio[i] === "Cliente") {
      filtered = sitiosCliente.filter((sitio) =>
        sitio.Nombre.toLowerCase().includes(value.toLowerCase())
      );
    }

    setFilteredSitios(filtered);

    // Guardamos el término de búsqueda para ese bloque específico
    setTiposSitio((prev) => ({
      ...prev,
      [`searchTerm_${i}`]: value,
      [`filteredSitios_${i}`]: filtered,
    }));
  };

  const handleSitioSelect = (sitioId, sitioNombre, i) => {
    setSitiosSeleccionados((prev) => ({
      ...prev,
      [i]: { sitioId, sitioNombre },
    }));

    setTiposSitio((prev) => ({
      ...prev,
      [`searchTerm_${i}`]: sitioNombre,
      [`filteredSitios_${i}`]: [],
    }));
  };

  useEffect(() => {
    async function obtenerDataSitios() {
      try {
        const res = await axios.post(
          "https://analisisderedapi.vesta-accelerate.com/api/SitioCrudApi/GetSitiosAduanas",
          {}
        );
        setSitiosAduana(res.data.Message);

        const res2 = await axios.post(
          "https://analisisderedapi.vesta-accelerate.com/api/SitioCrudApi/Index",
          { ClienteId: IdCliente.split(",")[0] }
        );
        setSitiosCliente(res2.data.Message);

        const res3 = await axios.post(
          "https://analisisderedapi.vesta-accelerate.com/api/SegmentoCrudApi/Index",
          { ClienteId: IdCliente.split(",")[0] }
        );
        setSegmentosPorCliente(res3.data.Message);
      } catch (err) {
        console.log(err);
      }
    }
    obtenerDataSitios();
  }, []);

  return (
    <>
      <div className="d-flex flex-wrap col-12 mt-1">
        <div className="col-12">
          <h6
            style={{
              backgroundColor: "#4375b4",
              padding: "2px",
              borderRadius: "5px",
              textAlign: "center",
              color: "white",
            }}>
            Sitios de la Ruta
          </h6>
        </div>
        <Form
          onSubmit={handleSubmit((data) => {
            const sitioSeleccionado = sitiosSeleccionados;
            // Agregar el sitio seleccionado a los datos del formulario
            datosFormulario = {
              ...data,
              sitio: sitioSeleccionado, // Agregar el valor del sitio al objeto de datos
            };
            console.log(datosFormulario);

            let json = {
              TipoDeclaracionId: 0,
              NombreRuta: Object.values(datosFormulario.sitio)
                .map((sitio) => sitio.sitioNombre.toUpperCase())
                .join("/"),
              Sitios: Object.values(datosFormulario.sitio).map((sitio, i) => {
                return {
                  Id: sitio.sitioId,
                  DuracionEntrada: datosFormulario[`HE${i + 1}`],
                  DuracionSalida: datosFormulario[`HS${i + 1}`],
                  Regimen: datosFormulario[`Regimen${i + 1}`],
                  SitioJump: false,
                };
              }),
              Segmentos: Object.values(datosFormulario.sitio)
                .filter((sitio, i) => i < Number(cantidad) - 1)
                .map((sitio, i) => {
                  return {
                    Id: datosFormulario[`segmento${i + 1}`],
                    Orden: i + 1,
                  };
                }),
              RutaCompuesta: [],
              CreatedBy: "0C3A7B92-34D7-453A-883F-24C15B24FF6A",
              ClienteId: IdCliente.split(",")[0],
              ClienteNombre: IdCliente.split(",")[1],
              Doccertificado: datosFormulario.aforo,
              AforoRuta: datosFormulario.docc,
              Clasificacion: "string",
            };
            console.log(json);
            // Abrir nueva ventana
            const newWindow = window.open("", "_blank");

            // Agregar HTML y estilos
            newWindow.document.write(`
    <html>
      <head>
        <title>JSON Generado</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; background: #f4f4f4; }
          .container { max-width: 700px; margin: auto; background: white; padding: 10px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
          pre { background: #272822; color: #f8f8f2; padding: 15px; border-radius: 5px; overflow-x: auto; overflow-y: auto; max-height: 500px; }
          button { background: #a4a4a4; color: white; padding: 10px 15px; border: none; border-radius: 5px; cursor: pointer; margin-top: 10px; }
          button:hover { background: #0056b3; }
        </style>
      </head>
      <body>
        <div class="container">
          <button onclick="copyToClipboard()">Copiar JSON</button>
          <pre id="json">${JSON.stringify(json, null, 2)}</pre>
        </div>
        <script>
          function copyToClipboard() {
            const jsonText = document.getElementById("json").innerText;
            navigator.clipboard.writeText(jsonText).then(() => {
              alert("JSON copiado al portapapeles!");
            });
          }
        </script>
      </body>
    </html>
  `);

            newWindow.document.close();
          })}
          className="d-flex flex-wrap w-100">
          <div className="col-12 mb-1">
            <ModalC ContenidoModal={<CrearSitios />} Nombre={"Crear Sitio"} />
            {/* <ModalC ContenidoModal={<Segmentos />} Nombre={"Crear Segmento"} /> */}
            <Form.Check // prettier-ignore
              type={"checkbox"}
              id={`default-checkbox`}
              label={`aforo`}
              style={{ display: "inline-block", marginLeft: "2px" }}
              {...register("aforo")}
            />
            <Form.Check // prettier-ignore
              type={"checkbox"}
              id={`default-checkbox2`}
              label={`Doccertificado`}
              style={{ display: "inline-block", marginLeft: "2px" }}
              {...register("docc")}
            />
            <Button
              style={{
                borderRadius: "5px",
                border: "none",
                color: "black",
                marginLeft: "10px",
                fontWeight: "bolder",
              }}
              type="submit"
              className="bg-warning">
              Crear Json Ruta
            </Button>
            <TfiReload
              style={{
                fontSize: "35px",
                backgroundColor: "#4375b4",
                borderRadius: "5px",
                color: "white",
                padding: "2px",
                marginLeft: "900px",
                cursor: "pointer",
              }}
              onClick={async () => {
                let confirmar = confirm("¿Desea recargar sitios y segmentos?");
                if (confirmar) {
                  try {
                    const res = await axios.post(
                      "https://analisisderedapi.vesta-accelerate.com/api/SitioCrudApi/GetSitiosAduanas",
                      {}
                    );
                    setSitiosAduana(res.data.Message);

                    const res2 = await axios.post(
                      "https://analisisderedapi.vesta-accelerate.com/api/SitioCrudApi/Index",
                      { ClienteId: IdCliente.split(",")[0] }
                    );
                    setSitiosCliente(res2.data.Message);

                    const res3 = await axios.post(
                      "https://analisisderedapi.vesta-accelerate.com/api/SegmentoCrudApi/Index",
                      { ClienteId: IdCliente.split(",")[0] }
                    );
                    setSegmentosPorCliente(res3.data.Message);
                    alert("Sitios y segmentos recargados correctamente");
                  } catch (err) {
                    alert("Error al recargar sitios y segmentos");
                    console.log(err);
                  }
                }
              }}
            />
          </div>
          {[...Array(Number(cantidad))].map((_, i) => (
            <>
              <div key={i} className="col-2 border border-1 gap-1 p-1 me-2">
                <h6>sitio {i + 1}</h6>
                <InputGroup size="sm" className="mb-1">
                  <InputGroup.Text id="inputGroup-sizing-sm">
                    Tipo
                  </InputGroup.Text>
                  <Form.Select
                    aria-describedby="inputGroup-sizing-sm"
                    value={tiposSitio[i] || ""}
                    onChange={(e) => handleTipoSitioChange(i, e.target.value)}>
                    <option value="">--Seleccione--</option>
                    <option value="Aduana">Aduana</option>
                    <option value="Cliente">Cliente</option>
                  </Form.Select>
                </InputGroup>

                {/* Input de búsqueda con lista flotante */}
                <InputGroup size="sm" className="mb-1 position-relative">
                  <InputGroup.Text
                    id="inputGroup-sizing-sm"
                    onClick={() => alert(sitiosSeleccionados[i].sitioId)}>
                    Sitio{i + 1}
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Buscar sitio"
                    name={`Sitio${i + 1}`}
                    value={tiposSitio[`searchTerm_${i}`] || ""}
                    onChange={(e) => handleSearchChange(e, i)}
                    aria-label="Buscar sitio"
                    disabled={
                      tiposSitio[i] !== "Aduana" && tiposSitio[i] !== "Cliente"
                    } // Deshabilitar si no es "Aduana" ni "Cliente"
                    style={{ fontSize: "10px" }}
                  />
                  {(tiposSitio[i] === "Aduana" ||
                    tiposSitio[i] === "Cliente") &&
                    tiposSitio[`searchTerm_${i}`] && (
                      <div
                        className="position-absolute w-100 mt-1 border border-1 bg-white"
                        style={{
                          zIndex: 10,
                          top: "100%",
                          left: 0,
                          maxHeight: "200px",
                          overflowY: "auto",
                        }}>
                        {(tiposSitio[i] === "Aduana"
                          ? tiposSitio[`filteredSitios_${i}`] || sitiosAduana
                          : tiposSitio[`filteredSitios_${i}`] || sitiosCliente
                        ).map((sitio) => (
                          <div
                            key={sitio.Id}
                            className="p-2"
                            style={{
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              handleSitioSelect(sitio.Id, sitio.Nombre, i)
                            }>
                            {sitio.Nombre}
                          </div>
                        ))}
                      </div>
                    )}
                </InputGroup>

                {/* Otros campos */}
                {i !== Number(cantidad) - 1 && (
                  <>
                    <InputGroup className="mb-2 position-relative" size="sm">
                      <InputGroup.Text id="inputGroup-sizing-sm">
                        Segm
                      </InputGroup.Text>
                      <Form.Select
                        aria-describedby="inputGroup-sizing-sm"
                        style={{ fontSize: "10px" }}
                        {...register(`segmento${i + 1}`, { required: true })}>
                      <option value="">--seleccione--</option>
                        {segmentosPorCliente
                          .sort((a, b) => {
                            const nombreA =
                              `${a.Sitio1Nombre} ${a.Sitio2Nombre}`.toLowerCase();
                            const nombreB =
                              `${b.Sitio1Nombre} ${b.Sitio2Nombre}`.toLowerCase();
                            return nombreA.localeCompare(nombreB);
                          })
                          .map((segmento) => (
                            <option key={segmento.Id} value={segmento.Id}>
                              {segmento.Sitio1Nombre} - {segmento.Sitio2Nombre}
                            </option>
                          ))}
                      </Form.Select>
                    </InputGroup>
                  </>
                )}

                <InputGroup size="sm" className="mb-1">
                  <InputGroup.Text id="inputGroup-sizing-sm">
                    HE
                  </InputGroup.Text>
                  <Form.Control
                    aria-label="Small"
                    aria-describedby="inputGroup-sizing-sm"
                    type="number"
                    {...register(`HE${i + 1}`)}
                  />
                </InputGroup>

                <InputGroup size="sm" className="mb-1">
                  <InputGroup.Text id="inputGroup-sizing-sm">
                    HS
                  </InputGroup.Text>
                  <Form.Control
                    aria-label="Small"
                    aria-describedby="inputGroup-sizing-sm"
                    type="number"
                    {...register(`HS${i + 1}`, { required: true })}
                  />
                </InputGroup>

                <InputGroup size="sm" className="mb-1">
                  <InputGroup.Text id="inputGroup-sizing-sm">
                    Regimen
                  </InputGroup.Text>
                  <Form.Select
                    aria-describedby="inputGroup-sizing-sm"
                    {...register(`Regimen${i + 1}`, { required: true })}>
                    <option value="N/A">N/A</option>
                    <option value="4000/IMPORTACIÓN DEFINITIVA">4000</option>
                    <option value="8100/TRÁNSITO HACIA ZOLI ZIP">8100</option>
                    <option value="4600/IMPORTACION DEFINITIVA FAUCA NO CANCELA TITULO">
                      4600
                    </option>
                    <option value="5000/ADMISION TEMP PERFEC ACTIVO CON TRANSFORMACION ZOLI">
                      5000
                    </option>
                  </Form.Select>
                </InputGroup>
              </div>
              {i + 1 < cantidad && (
                <div style={{ marginTop: "100px", marginRight: "8px" }}>
                  {/* <button
                      style={{
                        border: "none",
                        backgroundColor: "#6d9ad3",
                        fontSize: "12px",
                        color: "white",
                        borderRadius:"3px",
                        padding:"5px"
                      }}>
                      ←Segmento→{" "}
                    </button> */}
                  <ModalC
                    ContenidoModal={
                      <Segmentos
                        Sitio1Id={sitiosSeleccionados[i]?.sitioId}
                        Sitio2Id={sitiosSeleccionados[i + 1]?.sitioId}
                      />
                    }
                    Nombre={
                      <FaPlaneDeparture
                        style={{ fontWeight: "bolder", fontSize: "20px" }}
                      />
                    }
                  />
                </div>
              )}
            </>
          ))}
        </Form>
      </div>
    </>
  );
}
