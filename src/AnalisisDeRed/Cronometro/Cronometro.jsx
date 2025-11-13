import React from "react";
import { set, useForm } from "react-hook-form";
import { Form, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "../../api/axios";
import { Row, Col, Container } from "react-bootstrap";
import { toast } from "sonner";
import CreatedBy from "../../components/CreatedBy";

function Cronometro() {
  const { handleSubmit, register, setValue } = useForm();
  const [textAreaValue, setTextAreaValue] = useState("");
  const [proveedorId, setProveedorId] = useState("");
  const [cantidadIds, setCantidadIds] = useState(0);
  let [idsEliminados, setIdsEliminados] = useState([]);
  let cronometrosACrear;

  const onSubmit = async (values) => {
    setIdsEliminados([]);
    toast.promise(
      (async () => {
        let idsTextarea = values.rutasIds
          .split(/\s|,|\n/)
          .map((id) => id.trim())
          .filter((id) => id !== "");

        let originalCount = idsTextarea.length;

        for (const id of idsTextarea) {
          try {
            const cronometro = await axios.post(
              "https://analisisderedapi.vesta-accelerate.com/api/CronometroCrudApi/Index",
              { RutaId: id }
            );

            const cumple = cronometro.data.Message.some(
              (c) =>
                c.ClaseCronometro.Id ==
                  values.ClaseCronometroId.split(",")[0] &&
                c.ProveedorId?.toLowerCase() ==
                  values.ProveedorId?.toLowerCase()
            );

            if (cumple) {
              idsTextarea = idsTextarea.filter((x) => x !== id);
              setIdsEliminados((prev) => [...prev, id]);
              continue;
            }
          } catch (error) {
            console.error(
              `Error al verificar cronómetros para la ruta ${id}:`,
              error
            );
          }
        }

        const resp2 = await axios.post(
          "https://analisisderedapi.vesta-accelerate.com/api/RutaCrudApi/GetRutaByListId",
          { Ids: idsTextarea }
        );

        const jsonArray = resp2.data.Message.map((ruta) => {
          const sitiosOrdenados = [...ruta.SitiosPorRuta].sort(
            (a, b) => a.Orden - b.Orden
          );

          let json = {
            RutaId: ruta.Id,
            ProveedorId: `${values.ProveedorId}`,
            FacturaVesta: values.FacturaVesta ? true : false,
            Descripcion: values.ClaseCronometroId.split(",")[1],
            CapacidadCargaId: "e30abb7d-6bcf-47fc-ae06-16408152db78",
            SitioInicioId: `${values.SitioInicio}`,
            SitioFinId: `${values.SitioFin}`,
            TipoSelloInicioId: values.TipoSelloSitioInicio,
            TipoSelloFinId: values.TipoSelloSitioFin,
            CreatedBy: values.CreadaPor,
            ClaseCronometroId: values.ClaseCronometroId.split(",")[0],
            Horas: values.Horas ? true : false,
            Redondear: true,
            DiaMasDiaMenos: "0",
          };

          if (sitiosOrdenados.length > 2) {
            json.SitioInicioId = sitiosOrdenados[0].Sitio.Id;
            json.SitioFinId =
              sitiosOrdenados[sitiosOrdenados.length - 1].Sitio.Id;
          } else {
            json.SitioInicioId = ruta.SitiosPorRuta[0].Sitio.Id;
            json.SitioFinId = ruta.SitiosPorRuta[1].Sitio.Id;
          }

          return json;
        });

        setTextAreaValue(JSON.stringify(jsonArray, null, 2));

        return `Se generaron ${idsTextarea.length} jsons de ${originalCount}`;
      })(),
      {
        loading: "Procesando rutas...",
        success: (message) => message,
        error: "Ocurrió un error al generar los JSONs.",
      }
    );
  };

  useEffect(() => {
    console.log("hola");
  }, []);

  const crearCronometros = async () => {
    cronometrosACrear = JSON.parse(textAreaValue);
    toast("¿Está seguro de crear los cronómetros?", {
      action: {
        label: "Crear",
        onClick: () => {
          toast.promise(
            async () => {
              for (const cronometro of cronometrosACrear) {
                try {
                  console.log("vine");
                  await axios.post(
                    "https://analisisderedapi.vesta-accelerate.com/api/CronometroCrudApi/Create",
                    cronometro
                  );
                } catch (error) {
                  throw new Error(
                    `Error al crear cronómetro para la ruta ${cronometro.RutaId}: ${error}`
                  );
                }
              }
              return true;
            },
            {
              loading: "Creando cronómetros...",
              success: () => "Cronómetros creados exitosamente",
              error: (err) => "Error al crear cronómetros: " + err.message,
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
  };

  return (
    <Container className="p-4">
      <div className="d-flex w-100 justify-content-between">
        <div style={{ width: "33%" }}>
          <Form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white p-3 rounded">
            <Form.Group className="mb-1" controlId="exampleForm.ControlInput1">
              <Form.Label className="small">Proveedor</Form.Label>
              <Form.Select
                size="sm"
                aria-label="Default select example"
                {...register("ProveedorId", { required: true })}>
                <option value="">--seleccione--</option>
                <option value="843FDA15-4718-4E67-A65E-1D9F5F5A9E72">
                  MAERSK A/S TRADING AS SEALAND AMERICAS
                </option>
                <option value="7D1E6EA6-E653-4CE3-BEB5-1AE2D683F5AE">
                  MEDITERRANEAN SHIPPING COMPANY S.A. (MSC)
                </option>
                <option value="4338FDB5-0FFF-4349-9EC8-2524CB9C5865">
                  CMA CGM HONDURAS S DE R.L
                </option>
                <option value="07483760-EEF9-47B0-B157-200618649A2A">
                  DOLE OCEAN CARGO EXPRESS
                </option>
                <option value="816C1B90-9FD5-4FB8-BD4B-1B0F29A4EFD5">
                  SERVICIOS PORTUARIOS S.A DE C.V
                </option>
                <option value="2530F12F-36A8-41E5-AEBB-252740CD03E0">
                  COSCO SHIPPING
                </option>
                <option value="90657D0A-A251-4180-BDD9-1DFADBA214E7">
                  CHIQUITA
                </option>
                <option value="FDDA11AA-BE61-48F0-83B3-2524CD3EA740">
                  OCEAN NETWORK EXPRESS (ONE)
                </option>
                <option value="A6BBE895-1F5D-43E6-83DB-2524CAA32E97">
                  HAPPAG LLOYD
                </option>
                <option value="58BD1091-37FB-4D79-956E-1C05932A7905">
                  REPRESENTACIONES CROPA, S.A.
                </option>
                <option value="FC91F7BB-818A-46D8-A9F3-1AE04DB183F7">
                  VECONINTER
                </option>
                <option value="48C3EFA7-505C-4E3A-9C25-1B200868AE9C">
                  VENTO LOGISTICS ALLIANCE, S. A. DE C. V.
                </option>
                <option value="3B0DD85A-9B2A-4D0F-A0CC-1DCE0A11B73F">
                  Demurrage Collection Service (PROVEEDOR CHIQUITA)
                </option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-1" controlId="exampleForm.ControlInput1">
              <Form.Label className="small">Clase Cronometro</Form.Label>
              <Form.Select
                aria-label="Default select example"
                size="sm"
                {...register("ClaseCronometroId", { required: true })}>
                <option value="">--seleccione--</option>
                <option value={[1, "Estadía"]}>ESTADÍA</option>
                <option value={[2, "Demora"]}>DEMORA</option>
                <option value={[4, "Estadía Furgón y Cabeza"]}>
                  ESTADÍA FURGÓN Y CABEZA
                </option>
                <option value={[6, "Chasis"]}>CHASIS</option>
                <option value={[7, "Waiting Time Destination"]}>
                  WAITING TIME DESTINATION
                </option>
                <option value={[8, "Fuel"]}>FUEL</option>
                <option value={[9, "Sobreestadía"]}>SOBREESTADÍA</option>
                <option value={[10, "Genset"]}>GENSET</option>
                <option value={[11, "Monitoreo"]}>MONITOREO</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Row>
                <Col>
                  <Form.Label className="small">
                    TipoSelloSitioInicio
                  </Form.Label>
                  <Form.Select {...register("TipoSelloSitioInicio")} size="sm">
                    <option value="">--seleccione--</option>
                    <option value="1">Inicio</option>
                    <option value="2">Fin</option>
                  </Form.Select>
                </Col>
                <Col>
                  <Form.Label className="small">TipoSelloSitioFin</Form.Label>
                  <Form.Select {...register("TipoSelloSitioFin")} size="sm">
                    <option value="">--seleccione--</option>
                    <option value="1">Inicio</option>
                    <option value="2">Fin</option>
                  </Form.Select>
                </Col>
              </Row>
            </Form.Group>

            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Row>
                <Col>
                  <Form.Label className="small">FacturaVesta</Form.Label>
                  <Form.Check placeholder="" {...register("FacturaVesta")} />
                </Col>
                <Col>
                  <Form.Label className="small">Horas</Form.Label>
                  <Form.Check placeholder="" {...register("Horas")} />
                </Col>
              </Row>
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <CreatedBy
                register={register}
                estilos={{ marginBottom: "2px", fontSize: "12px" }}
              />
            </Form.Group>

            <Form.Group className="mb-1" controlId="formCliente">
              <Form.Label className="small">
                RutasId: {cantidadIds > 0 ? cantidadIds : 0}
              </Form.Label>
              <textarea
                style={{ width: "100%", height: "150px" }}
                {...register("rutasIds", { required: true })}
                onChange={(e) => {
                  if (e.target.value === "") {
                    setCantidadIds(0);
                    return;
                  }
                  const value = e.target.value;
                  setCantidadIds(value.split("\n").length);
                }}></textarea>
            </Form.Group>
            <Button variant="secondary" type="submit" style={{ width: "100%" }}>
              Generar
            </Button>
            <Button
              variant="success"
              onClick={crearCronometros}
              style={{ width: "100%", marginTop: "10px" }}>
              Enviar
            </Button>
          </Form>
        </div>

        <Row style={{ width: "65%" }}>
          <Col className="col-8">
            <textarea
              value={textAreaValue}
              readOnly
              style={{ width: "100%", height: "100%" }}></textarea>
          </Col>
          <Col className="col-4">
            {/* <textarea
              value={idsEliminados.join("\n")}
              style={{ width: "100%", height: "10%" }}></textarea> */}
            {idsEliminados.length > 0 && (
              <p>
                Rutas que ya tenían cronómetro
                <br />
                {idsEliminados.map((id, index) => (
                  <span key={id} style={{ fontSize: "11px" }}>
                    {id}
                    <br />
                  </span>
                ))}
              </p>
            )}
          </Col>
        </Row>
      </div>
    </Container>
  );
}

export default Cronometro;
