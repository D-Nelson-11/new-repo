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
import { toast } from "sonner";
import CreatedBy from "../../components/CreatedBy";
import { Modal } from "react-bootstrap";

export function RutaSimple({ cantidad, IdCliente }) {
  let [sitiosAduana, setSitiosAduana] = useState([]);
  let [sitiosCliente, setSitiosCliente] = useState([]);
  let [segmentosPorCliente, setSegmentosPorCliente] = useState([]);
  const [tiposSitio, setTiposSitio] = useState({});
  const [sitiosSeleccionados, setSitiosSeleccionados] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSitios, setFilteredSitios] = useState([]);
  const { register, getValues, handleSubmit, setValue } = useForm();
  const [showModal, setShowModal] = useState(false);
  const [textAreaValue, setTextAreaValue] = useState("");
  const form2 = useForm();

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

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
              backgroundColor: "#4a5a85",
              padding: "2px",
              borderRadius: "5px",
              textAlign: "center",
              color: "white",
            }}>
            Sitios de la Ruta
          </h6>
        </div>
        <ModalC ContenidoModal={<CrearSitios />} Nombre={"Crear Sitio"} />
        <Modal
          show={showModal}
          onHide={handleClose}
          size="xl"
          centered
          backdrop="static">
          <Modal.Header closeButton>
          </Modal.Header>
          <Form
            onSubmit={form2.handleSubmit(async (data) => {
              toast("¿Está seguro de crear la ruta?", {
                action: {
                  label: "Crear",
                  onClick: () => {
                    toast.promise(
                      axios.post(
                        "https://analisisderedapi.vesta-accelerate.com/api/RutaCrudApi/Create",
                        JSON.parse(textAreaValue)
                      ),
                      {
                        loading: "Creando ruta...",
                        success: (resp) => {
                          console.log(resp);
                          return `RutaId: ${resp.data.Message.Id}`;
                        },
                        error: (err) => {
                          console.log(err);
                          return "Error de red o inesperado";
                        },
                        duration: 20000,
                      }
                    );
                  },
                },
                cancel: {
                  label: "Cancelar",
                },
                duration: 20000,
                position: "top-center",
              });
            })}>
            <Modal.Body>
              <Form.Control
                as="textarea"
                rows={15}
                value={textAreaValue}
                onChange={(e) => setTextAreaValue(e.target.value)}
                style={{ height: "550px" }}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="success" type="submit">
                Crear Ruta
              </Button>
              <Button variant="danger" onClick={handleClose}>
                Cerrar
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
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
              LineaProducto: "Inbound",
              RutaCompuesta: [],
              CreatedBy: datosFormulario.CreadaPor,
              ClienteId: IdCliente.split(",")[0],
              ClienteNombre: IdCliente.split(",")[1],
              Doccertificado: datosFormulario.docc,
              AforoRuta: datosFormulario.aforo,
              Clasificacion: datosFormulario.Clasificacion,
            };
            setTextAreaValue(JSON.stringify(json, null, 2));
            handleShow(); // abrir modal
          })}
          className="d-flex flex-wrap w-100">
          <div className="col-12 mb-1">
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
                fontSize: "12px",
              }}
              {...register("Clasificacion")}>
              <option value="">--Clasificacion--</option>
              <option value="IB/CPG/MP-Empaque">IB/CPG/MP-Empaque</option>
              <option value="IB/CPG/MP-Contenerizado">
                IB/CPG/MP-Contenerizado
              </option>
              <option value="IB/CPG/MP-Refrigerado">
                IB/CPG/MP-Refrigerado
              </option>
              <option value="IB/CPG/PT">IB/CPG/PT</option>
              <option value="IB/CPG/M&P">IB/CPG/M&P</option>
              <option value="IB/RETAIL/PT">IB/RETAIL/PT</option>
              <option value="IB/M&P">IB/M&P</option>
              <option value="IB/LSP">IB/LSP</option>
              <option value="IB/PT">IB/PT</option>
            </select>
            <CreatedBy register={register} />
            <Button
              style={{
                borderRadius: "5px",
                border: "none",
                color: "white",
                marginLeft: "10px",
                backgroundColor: "#c86666",
              }}
              type="submit">
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
                toast.promise(
                  (async () => {
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
                  })(),
                  {
                    loading: "Recargando sitios y segmentos...",
                    success: () =>
                      "Sitios y segmentos recargados correctamente",
                    error: () => "Error al recargar sitios y segmentos",
                  }
                );
              }}
            />
            {/* Modal con el JSON */}
          </div>
          {[...Array(Number(cantidad))].map((_, i) => (
            <>
              <div
                key={i}
                className="col-2 border border-1 gap-1 p-1 me-2 mt-1">
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

                {/* Otros campos */}
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
                    {...register(`HE${i + 1}`, { required: true })}
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
                    <option value="4600/IMPORTACION DEFINITIVA FAUCA NO CANCELA TITULO">
                      4600
                    </option>
                    <option value="5000/ADMISION TEMP PERFEC ACTIVO CON TRANSFORMACION ZOLI">
                      5000
                    </option>
                    <option value="5100/ADMISIÓN TEMPORAL PARA PERFECCIONAMIENTO ACTIVO TRANSFO">
                      5100
                    </option>
                    <option value="5200/ADMISION TEMP0RAL  P/ PERFECC ACTIVO SIN TRANSFOR ZOLI">
                      5200
                    </option>
                    <option value="5600/ADM TEMP P/ PERFEC  ACTIVO RIT SIN TRANSFORMACION">
                      5600
                    </option>
                    <option value="8100/TRÁNSITO HACIA ZOLI ZIP">8100</option>
                    <option value="TRANSITO ZONA LIBRE NO CANCELA TITULO (FAUCA)">
                      8300
                    </option>
                    <option value="ID/IMPORTACION DEFINITIVA">ID</option>
                    <option value="FI/Formulario Aduanero Unico Centroamericano de Importacion">
                      FI
                    </option>
                    <option value="DI/Extraccion para Importacion Definitiva">
                      DI
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
                        style={{ fontWeight: "bolder", fontSize: "14px" }}
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
