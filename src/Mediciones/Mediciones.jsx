import { useState, useEffect } from "react";
import { Form, Button, Container } from "react-bootstrap";
import ClientesSelect from "../components/ClientesSelect";
import { colors } from "../theme/colors";
import { useForm } from "react-hook-form";
import axios from "../api/axios";
import { toast } from "sonner";

const Mediciones = () => {
  const { register, handleSubmit } = useForm();
  const [clientes, setClientes] = useState([]);
  const [cantidadIds, setCantidadIds] = useState(0);
  const [rutasFaltantes, setRutasFaltantes] = useState([]);
  const [loading, setLoading] = useState(false);

  return (
    <Container className="mt-4">
      <h3 style={{ color: colors.primary }}>Mediciones</h3>
      <hr />
      <div className="d-flex">
        <div
          style={{
            width: "30%",
            borderRight: "1px solid #ccc",
            paddingRight: "20px",
          }}>
          <Form
            onSubmit={handleSubmit(async (data) => {
              try {
                if (data.rutasIds == ""){
                  toast.error("No hay Ids en el textarea");
                  return;
                }
                setLoading(true);
                const resp = await axios.post(
                  "https://analisisderedapi.vesta-accelerate.com/api/RutaCrudApi/Index",
                  { ClienteId: data.IdCliente.split(",")[0] }
                );
                const idsTextarea = data.rutasIds
                  .split(/\s|,|\n/)
                  .map((id) => id.trim().toLowerCase()); // <- normalizamos

                if (idsTextarea.length === 0) {
                  toast.error("No hay Ids en el textarea");
                  return;
                }

                const array = resp.data.Message.map((r) =>
                  r.Id.trim().toLowerCase()
                ); // <- normalizamos

                const faltantes = array.filter(
                  (id) => !idsTextarea.includes(id)
                );

                const resp2 = await axios.post(
                  "https://analisisderedapi.vesta-accelerate.com/api/RutaCrudApi/GetRutaByListId",
                  { Ids: faltantes }
                );
                console.log(resp2);
                setRutasFaltantes(
                  resp2.data.Message.map((ruta) => {
                    const sitioConEsquema = ruta.SitiosPorRuta?.find(
                      (sitio) => sitio.Esquemas && sitio.Esquemas.length > 0
                    );

                    return {
                      Id: ruta.Id,
                      NombreRuta: ruta.NombreRuta,
                      esRutaHija: ruta.RutaPadreId === null ? "No" : "Sí",
                      sitiosPorRuta: ruta.SitiosPorRuta
                        ? ruta.SitiosPorRuta.length
                        : 0,
                      RutaPadre: ruta.RutaPadreId ? ruta.RutaPadreId : "N/A",
                      Aduana: sitioConEsquema?.Sitio?.Nombre || "N/A",
                    };
                  })
                );
              } catch (error) {
                console.log(error);
                setLoading(false);
                toast.error("Error al obtener las rutas faltantes");
              } finally {
                setLoading(false);
              }

              // setRutasFaltantes(faltantes.map((ruta)=>{
              //   return ()
              // }));
            })}>
            <Form.Group className="mb-3" controlId="formCliente">
              <Form.Label>Cliente</Form.Label>
              <ClientesSelect register={register} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formCliente">
              <Form.Label>RutasId</Form.Label>
              <textarea
                style={{ width: "100%", height: "300px" }}
                {...register("rutasIds")}
                onChange={(e) => {
                  if (e.target.value === "") {
                    setCantidadIds(0);
                    return;
                  }
                  const value = e.target.value;
                  setCantidadIds(value.split("\n").length);
                }}></textarea>
            </Form.Group>
            <p>Cantidad de Ids: {cantidadIds}</p>
            <Button variant="success" type="submit" style={{ width: "100%" }}>
              Enviar
            </Button>
          </Form>
        </div>
        <div style={{ width: "70%", marginLeft: "20px" }}>
          <div
            className="table-responsive"
            style={{
              maxHeight: "500px",
              overflowX: "auto",
              overflowY: "auto",
            }}>
            <table
              className="table table-sm"
              style={{
                minWidth: 1200 /* ajustar según columnas */,
                tableLayout: "auto",
              }}>
              <thead
                className="table-light"
                style={{ position: "sticky", top: 0, zIndex: 1 }}>
                <tr>
                  <th style={{ width: "20px" }}>N°</th>
                  <th style={{ width: "290px" }}>RutaId</th>
                  <th style={{ width: "90px" }}>Esquema</th>
                  <th style={{ width: "250px" }}>Aduana</th>
                  <th style={{ width: "80px" }}>Es Hija</th>
                  <th style={{ width: "150px" }}>Ruta Padre</th>
                  <th style={{ width: "20px" }}>SxR</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center">
                      Cargando rutas...
                    </td>
                  </tr>
                ) : rutasFaltantes.length > 0 ? (
                  rutasFaltantes.map((ruta, i) => (
                    <tr key={ruta.Id}>
                      <td style={{ whiteSpace: "nowrap" }}>{i + 1}</td>
                      <td>{ruta.Id}</td>
                      <td>{ruta.Esquema}</td>
                      <td>{ruta.Aduana}</td>
                      <td style={{ whiteSpace: "nowrap" }}>
                        {ruta.esRutaHija}
                      </td>
                      <td style={{ whiteSpace: "nowrap" }}>{ruta.RutaPadre}</td>
                      <td style={{ whiteSpace: "nowrap" }}>
                        {ruta.sitiosPorRuta}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center">
                      No hay rutas faltantes
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Mediciones;
