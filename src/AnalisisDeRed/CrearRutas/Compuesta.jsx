import { Form, InputGroup, Button } from "react-bootstrap";
import ModalC from "../../components/ModalC";
import CrearSitios from "./CrearSitios";
import axios from "../../api/axios";
import { useEffect, useState } from "react";
import Segmentos from "../../Persona/Segmentos/Segmentos";
import { TfiReload } from "react-icons/tfi";
import { useForm } from "react-hook-form";
import { FaPlaneDeparture } from "react-icons/fa";
import SearchBar from "../../components/SearchBar";
export function SitiosRutaMadre({ cantidad, IdCliente, cantidadHija }) {
  let [sitiosAduana, setSitiosAduana] = useState([]);
  let [sitiosCliente, setSitiosCliente] = useState([]);
  let [segmentosPorCliente, setSegmentosPorCliente] = useState([]);
  const [tiposSitio, setTiposSitio] = useState({});
  const [sitiosSeleccionados, setSitiosSeleccionados] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSitios, setFilteredSitios] = useState([]);
  const { register, getValues, handleSubmit, setValue } = useForm();
  const [loading, setLoading] = useState(false);
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
            Sitios ruta madre
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
              TipoDeclaracionId: 6,
              NombreRuta: Object.values(datosFormulario.sitio)
                .map((sitio) => sitio.sitioNombre.toUpperCase())
                .join("/"),
              Sitios: Object.values(datosFormulario.sitio)
                .filter((sitio, i) => i < Number(cantidad))
                .map((sitio, i) => {
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
              LineaProducto: "Inbound",
              RutaCompuesta: [
                {
                  TipoDeclaracionId: 0,
                  NombreRuta: Object.values(datosFormulario.sitio)
                    .filter((sitio, i) => i + 1 > Number(cantidad))
                    .map((sitio) => sitio.sitioNombre.toUpperCase())
                    .join("/"),
                  Sitios: Object.values(datosFormulario.sitio)
                    .filter((sitio, i) => i + 1 > Number(cantidad))
                    .map((sitio, i) => {
                      return {
                        Id: sitio.sitioId,
                        DuracionEntrada:
                          datosFormulario[`HE${i + 1 + Number(cantidad)}`],
                        DuracionSalida:
                          datosFormulario[`HS${i + 1 + Number(cantidad)}`],
                        Regimen:
                          datosFormulario[`Regimen${i + 1 + Number(cantidad)}`],
                        SitioJump: false,
                      };
                    }),
                  // ejemplo: i = 5 , entonces 5 = a 6-1? si entonces devuelve un solo elemento para recorrer en .map, es para saber cuantos segmentos hay en la hija
                  Segmentos: Array.from({ length: cantidadHija - 1 }).map(
                    (_, i) => {
                      return {
                        Id: datosFormulario[`segmentoH${i + 1}`],
                        Orden: i + 1,
                      };
                    }
                  ),
                  LineaProducto: "Inbound",
                  RutaCompuesta: [],
                  CreatedBy: datosFormulario.CreadaPor,
                  ClienteId: IdCliente.split(",")[0],
                  ClienteNombre: IdCliente.split(",")[1],
                  Doccertificado: datosFormulario.docc,
                  AforoRuta: datosFormulario.aforo,
                  Clasificacion: datosFormulario.Clasificacion,
                },
              ],
              CreatedBy: datosFormulario.CreadaPor,
              ClienteId: IdCliente.split(",")[0],
              ClienteNombre: IdCliente.split(",")[1],
              Doccertificado: datosFormulario.docc,
              AforoRuta: datosFormulario.aforo,
              Clasificacion: datosFormulario.Clasificacion,
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
          className="d-flex flex-wrap w-100 mt-2">
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
            <select
              style={{
                display: "inline-block",
                marginLeft: "4px",
                borderRadius: "5px",
                border: "none",
                color: "black",
                fontSize:"12px"
              }}
              {...register("Clasificacion")}>
              <option value="">--Clasificacion--</option>
              <option value="IB/CPG/MP-Empaque">IB/CPG/MP-Empaque</option>
              <option value="IB/CPG/MP-Contenerizado">IB/CPG/MP-Contenerizado</option>
              <option value="IB/CPG/MP-Refrigerado">IB/CPG/MP-Refrigerado</option>
              <option value="IB/CPG/PT">IB/CPG/PT</option>
              <option value="IB/CPG/M&P">IB/CPG/M&P</option>
              <option value="IB/RETAIL/PT">IB/RETAIL/PT</option>
              <option value="IB/M&P">IB/M&P</option>
              <option value="IB/LSP">IB/LSP</option>
              <option value="IB/PT">IB/PT</option>

            </select>
             <select
              style={{
                display: "inline-block",
                marginLeft: "4px",
                borderRadius: "5px",
                border: "none",
                color: "black",
                fontSize:"12px"
              }}
              {...register("CreadaPor",{ required: true })}>
              <option value="">--CreadaPor--</option>
              <option value="F41CE2B9-F392-4198-8E2F-1329C96111C9">Gabriela</option>
              <option value="C183E6D0-6855-4613-A85D-24F1E30E165E">Fredy</option>
              <option value="0C3A7B92-34D7-453A-883F-24C15B24FF6A">David</option>
              <option value="3193F743-6761-45EB-BFED-26A60DD442D5">Nohelia</option>

            </select>
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
            {loading && (
              <p style={{ display: "inline-block", marginLeft: "600px" }}>
                actualizando...
              </p>
            )}

            <TfiReload
              style={{
                fontSize: "35px",
                backgroundColor: "#4375b4",
                borderRadius: "5px",
                color: "white",
                padding: "2px",
                marginLeft: !loading ? "700" : "10px",
                cursor: "pointer",
              }}
              onClick={async () => {
                let confirmar = confirm("¿Desea recargar sitios y segmentos?");
                if (confirmar) {
                  try {
                    setLoading(true);
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
                    setLoading(false);
                    alert("Sitios y segmentos recargados correctamente");
                  } catch (err) {
                    alert("Error al recargar sitios y segmentos");
                    console.log(err);
                    setLoading(false);
                  }
                }
              }}
            />
          </div>
          {[...Array(Number(cantidad))].map((_, i) => (
            <>
              <div key={i} className="col-2 border border-1 gap-1 p-1 me-2">
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
                    onClick={() => {
                      alert(sitiosSeleccionados[i].sitioId);
                    }}>
                    Sitio{i + 1}
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    autoComplete="off"
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
                {/* segmentos */}
                {i !== Number(cantidad) - 1 && (
                  <>
                    <InputGroup className="mb-2 position-relative" size="sm">
                      <SearchBar
                        items={segmentosPorCliente}
                        register={register}
                        setValue={setValue}
                        i={i + 1}
                        hija={false}
                        getValues={getValues}
                      />
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
                    <option value="5200/ADMISION TEMP0RAL  P/ PERFECC ACTIVO SIN TRANSFOR ZOLI">
                      5000
                    </option>
                    <option value="5200/ADMISION TEMP0RAL  P/ PERFECC ACTIVO SIN TRANSFOR ZOLI">
                      5200
                    </option>
                  </Form.Select>
                </InputGroup>
              </div>
              {i + 1 < cantidad && (
                <div style={{ marginTop: "100px", marginRight: "8px" }}>
                  <ModalC
                    ContenidoModal={
                      <Segmentos
                        Sitio1Id={sitiosSeleccionados[i]?.sitioId}
                        Sitio2Id={sitiosSeleccionados[i + 1]?.sitioId}
                        ClienteId={IdCliente}
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
          <SitiosRutaHija
            cantidad={cantidadHija}
            IdCliente={IdCliente}
            register={register}
            cantidadMadre={cantidad}
            setSitiosSeleccionados={setSitiosSeleccionados}
            sitiosSeleccionados={sitiosSeleccionados}
            sitiosAduana={sitiosAduana}
            sitiosCliente={sitiosCliente}
            segmentosPorCliente={segmentosPorCliente}
            setValue={setValue}
            getValues={getValues}
          />
        </Form>
      </div>
    </>
  );
}

export function SitiosRutaHija({
  cantidad,
  IdCliente,
  register,
  cantidadMadre,
  setSitiosSeleccionados,
  sitiosSeleccionados,
  sitiosAduana,
  sitiosCliente,
  segmentosPorCliente,
  setValue,
  getValues
}) {
  const [tiposSitio, setTiposSitio] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSitios, setFilteredSitios] = useState([]);

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
      [i + Number(cantidadMadre)]: { sitioId, sitioNombre },
    }));

    setTiposSitio((prev) => ({
      ...prev,
      [`searchTerm_${i}`]: sitioNombre,
      [`filteredSitios_${i}`]: [],
    }));
  };

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
            Sitios ruta Hija
          </h6>
        </div>
        {[...Array(Number(cantidad))].map((_, i) => (
          <>
            <div key={i} className="col-2 border border-1 gap-1 p-1 me-2">
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
                  onClick={() => {
                    alert(
                      sitiosSeleccionados[i + Number(cantidadMadre)].sitioId
                    );
                  }}>
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
                {(tiposSitio[i] === "Aduana" || tiposSitio[i] === "Cliente") &&
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
                    <SearchBar
                      items={segmentosPorCliente}
                      register={register}
                      setValue={setValue}
                      i={i + 1}
                      hija={true}
                      getValues={getValues}
                    />
                  </InputGroup>
                </>
              )}

              <InputGroup size="sm" className="mb-1">
                <InputGroup.Text id="inputGroup-sizing-sm">HE</InputGroup.Text>
                <Form.Control
                  aria-label="Small"
                  aria-describedby="inputGroup-sizing-sm"
                  type="number"
                  {...register(`HE${i + 1 + Number(cantidadMadre)}`, {
                    required: true,
                  })}
                />
              </InputGroup>

              <InputGroup size="sm" className="mb-1">
                <InputGroup.Text id="inputGroup-sizing-sm">HS</InputGroup.Text>
                <Form.Control
                  aria-label="Small"
                  aria-describedby="inputGroup-sizing-sm"
                  type="number"
                  {...register(`HS${i + 1 + Number(cantidadMadre)}`, {
                    required: true,
                  })}
                />
              </InputGroup>

              <InputGroup size="sm" className="mb-1">
                <InputGroup.Text id="inputGroup-sizing-sm">
                  Regimen
                </InputGroup.Text>
                <Form.Select
                  aria-describedby="inputGroup-sizing-sm"
                  {...register(`Regimen${i + 1 + Number(cantidadMadre)}`, {
                    required: true,
                  })}>
                  <option value="N/A">N/A</option>
                  <option value="4000/IMPORTACIÓN DEFINITIVA">4000</option>
                  <option value="4000/TRÁNSITO HACIA ZOLI ZIP">8100</option>
                  <option value="4600/IMPORTACION DEFINITIVA FAUCA NO CANCELA TITULO">
                    4600
                  </option>
                  <option value="5000/ADMISION TEMP PERFEC ACTIVO CON TRANSFORMACION ZOLI">
                    5000
                  </option>
                  <option value="5200/ADMISION TEMP0RAL  P/ PERFECC ACTIVO SIN TRANSFOR ZOLI">
                    5200
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
                      Sitio1Id={
                        sitiosSeleccionados[i + Number(cantidadMadre)]?.sitioId
                      }
                      Sitio2Id={
                        sitiosSeleccionados[i + 1 + Number(cantidadMadre)]
                          ?.sitioId
                      }
                      ClienteId={IdCliente}
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
      </div>
    </>
  );
}
