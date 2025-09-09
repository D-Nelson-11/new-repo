import axios from "../../api/axios";
import { useEffect, useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

function ModificarSitioVesta() {
  const [datos, setDatos] = useState({});
  const { register, handleSubmit } = useForm();
  let [loading, setLoading] = useState(true);
  let [cambio, setCambio] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://personasapi.vesta-accelerate.com/api/PersonaColaboradorVestaServiceApi/IndexById/29D06AE8-4281-4B2C-B16F-1DF4AA0EE440"
        );
        setDatos(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

    useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://personasapi.vesta-accelerate.com/api/PersonaColaboradorVestaServiceApi/IndexById/29D06AE8-4281-4B2C-B16F-1DF4AA0EE440"
        );
        setDatos(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [cambio]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <Card
      className="shadow p-3 mt-4 rounded-3"
      style={{ maxWidth: "500px", margin: "auto" }}>
      <Card.Body>
        <h5 className="mb-3 text-center">Modificar Aduana</h5>
        <p>
          <strong>Usuario:</strong> {datos.NombreUsuario}
        </p>
        <p>
          <strong>Aduana Actual:</strong> {datos.SitioVestaNombre.toUpperCase()}
        </p>

        <Form
          onSubmit={handleSubmit(async (data) => {
            toast.promise(
              (async () => {
                const resp = await axios.post(
                  "https://personasapi.vesta-accelerate.com/api/PersonaColaboradorVestaServiceApi/ModificarSitioVestaId",
                  {
                    Id: "29D06AE8-4281-4B2C-B16F-1DF4AA0EE440",
                    ModifiedBy: "29D06AE8-4281-4B2C-B16F-1DF4AA0EE440",
                    SitioVestaId: data.aduana,
                  }
                );
                setCambio(!cambio);
              })(),
              {
                loading: "Modificando aduana...",
                success: () => "Cambio realizado correctamente",
                error: () => "Error al modificar la aduana",
              }
            );
          })}>
          <Form.Group className="mb-3">
            <Form.Label>Seleccione una Aduana</Form.Label>
            <Form.Select {...register("aduana", { required: true })}>
              <option value="">-- Selecciona una aduana --</option>
              <option value="3601805B-4AE7-48C6-9C1A-121AB4C25822">
                PUERTO CORTÉS
              </option>
              <option value="5B003AEB-5873-4CA2-9085-2721FFA69882">
                PROYESA
              </option>
            </Form.Select>
          </Form.Group>

          <div className="text-center">
            <Button variant="primary" type="submit">
              Guardar cambios
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default ModificarSitioVesta;
