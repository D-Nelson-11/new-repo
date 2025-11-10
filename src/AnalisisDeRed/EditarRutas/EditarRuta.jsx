import React, { useEffect, useState } from "react";
import { Container, Form, Button, Row, Col, Card } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import axios from "../../api/axios";
import FormAggSitio from "./FormAggSitio";
import ModalC from "../../components/ModalC";
import { CgArrowRight } from "react-icons/cg";
import { TimeLine } from "./Timeline";

function EditarRuta() {
  const { register, handleSubmit } = useForm();
  const formEdit = useForm();
  const formEditSegmento = useForm();
  const [rutaData, setRutaData] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null); // índice del sitio que se está editando
  const [segmentoIndex, setSegmentoIndex] = useState(null); // índice del segmento que se está editando

  const onSubmit = async (data) => {
    toast.promise(
      (async () => {
        const resp = await axios.post(
          "https://analisisderedapi.vesta-accelerate.com/api/RutaCrudApi/GetRutaById",
          { Id: data.RutaId }
        );
        setRutaData(resp.data.Message);
        return resp.data.Message;
      }),
      {
        loading: "Cargando...",
        success: (data) => {
          return `Ruta encontrada`;
        },
        error: () => "Error al cargar la ruta",
      }
    );
  };
  return (
    <Container className="w-100 mt-2" fluid>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col className="col-3">
            <Form.Label>RutaId</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingresar Id"
              {...register("RutaId")}
            />
          </Col>
          <Col>
            <Button
              variant="success"
              type="submit"
              style={{ marginTop: "30px" }}>
              Buscar
            </Button>
          </Col>
        </Row>
      </Form>

      {rutaData && rutaData.SitiosPorRuta?.length > 0 && (
        <Row className="mt-4">
          <div className="d-flex flex-wrap align-items-center gap-3 mb-3">
            <div>
              <strong>Cliente:</strong> {rutaData.ClienteNombre}{" "}
              <small>({rutaData.ClienteId})</small>
            </div>
            <div className="vr" />
            <div>
              <strong>Ruta:</strong> {rutaData.NombreRuta}
            </div>
          </div>

          <TimeLine
            items={rutaData.SitiosPorRuta}
            segmentos={rutaData.SegmentosPorRuta}
            rutaId ={rutaData.Id}
          />
        </Row>
      )}
    </Container>
  );
}

export default EditarRuta;
