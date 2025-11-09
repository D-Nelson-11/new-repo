import React, { useEffect, useState } from "react";
import { Container, Form, Button, Row, Col, Card } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import axios from "../../api/axios";
import FormAggSitio from "./FormAggSitio";
import ModalC from "../../components/ModalC";
import { CgArrowRight } from "react-icons/cg";
import {TimeLine} from './Timeline'

function EditarRuta() {
  const { register, handleSubmit } = useForm();
  const formEdit = useForm();
  const formEditSegmento = useForm();
  const [rutaData, setRutaData] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null); // índice del sitio que se está editando
  const [segmentoIndex, setSegmentoIndex] = useState(null); // índice del segmento que se está editando

  const onSubmit = async (data) => {
    const resp = await axios.post(
      "https://analisisderedapi.vesta-accelerate.com/api/RutaCrudApi/GetRutaById",
      { Id: data.RutaId }
    );
    setRutaData(resp.data.Message);
    console.log(resp.data.Message);
  };

  const handleEditClick = (index) => {
    setEditingIndex(index);
  };
  const handleEditSegmentoClick = (index) => {
    setSegmentoIndex(index);
  };

  const handleDelete = (sitio) => {
    toast("¿Desea eliminar el sitio de esta ruta?", {
      action: {
        label: "Eliminar",
        onClick: () => {
          toast.promise(
            async () => {
              const resp = await axios.post(
                "https://analisisderedapi.vesta-accelerate.com/api/RutaCrudApi/EditRutaSitios",
                {
                  RutaId: sitio.RutaId,
                  CreatedBy: "0C3A7B92-34D7-453A-883F-24C15B24FF6A",
                  SitiosCorregir: [
                    {
                      SitioId: sitio.SitioId,
                      Accion: 2,
                    },
                  ],
                }
              );
              const resp2 = await axios.post(
                "https://analisisderedapi.vesta-accelerate.com/api/RutaCrudApi/GetRutaById",
                { Id: sitio.RutaId }
              );
              setRutaData(resp2.data.Message);
              setEditingIndex(null);
            },
            {
              loading: "Eliminando sitio...",
              success: (resp) => {
                return `Sitio eliminado con éxito`;
              },
              error: (err) => {
                console.log(err);
                setEditingIndex(null);
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
  };

  const handleDeleteSegmento = (segmento) => {
    toast("¿Desea eliminar el segmento de esta ruta?", {
      action: {
        label: "Eliminar",
        onClick: () => {
          toast.promise(
            async () => {
              let json = {};
              const resp = await axios.post(
                "https://analisisderedapi.vesta-accelerate.com/api/RutaCrudApi/EditRutaSegmentos",
                {
                  RutaId: rutaData.Id,
                  CreatedBy: "0C3A7B92-34D7-453A-883F-24C15B24FF6A",
                  SegmentosCorregir: [
                    {
                      SegmentoId: segmento.Segmento.Id,
                      Accion: 2,
                    },
                  ],
                }
              );
              const resp2 = await axios.post(
                "https://analisisderedapi.vesta-accelerate.com/api/RutaCrudApi/GetRutaById",
                { Id: rutaData.Id }
              );
              setRutaData(resp2.data.Message);
              setSegmentoIndex(null);
            },
            {
              loading: "Eliminando segmento...",
              success: (resp) => {
                return `segmento eliminado con éxito`;
              },
              error: (err) => {
                console.log(err);
                setSegmentoIndex(null);
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
          <Row className="mb-3">
            <Col>
              <p>
                <strong>Cliente:</strong> {rutaData.ClienteNombre} -{" "}
                {rutaData.ClienteId}
              </p>
              <p>
                <strong>Ruta:</strong> {rutaData.NombreRuta}
              </p>
            </Col>
            {/* <Col className="col-12 d-flex align-items-center gap-2">
              <h4 className="m-0">Sitios: {rutaData.SitiosPorRuta.length}</h4>
              <ModalC ContenidoModal={<FormAggSitio />} Nombre={"Añadir"} />
            </Col> */}
          </Row>

          <TimeLine items={rutaData.SitiosPorRuta} />



          {/* {rutaData.SitiosPorRuta.sort((a, b) => a.Orden - b.Orden).map(
            (sitio, index) => (
              <Col key={index} md={3} className="mb-3">
                <Card>
                  <Card.Body>
                    {editingIndex === index ? (
                      <>
                        <Form
                          onSubmit={formEdit.handleSubmit(async (data) => {
                            let json = {
                              RutaId: sitio.RutaId,
                              CreatedBy: "0C3A7B92-34D7-453A-883F-24C15B24FF6A",
                              SitiosCorregir: [
                                {
                                  SitioId: sitio.SitioId,
                                  Regimen: data[`Regimen_${index}`],
                                  DuracionEntrada:
                                    data[`DuracionEntrada_${index}`],
                                  DuracionSalida:
                                    data[`DuracionSalida_${index}`],
                                  Accion: 3,
                                },
                              ],
                            };
                            console.log("json", json);
                            toast("¿Está seguro de editar el sitio?", {
                              action: {
                                label: "Editar",
                                onClick: () => {
                                  toast.promise(
                                    async () => {
                                      const resp = await axios.post(
                                        "https://analisisderedapi.vesta-accelerate.com/api/RutaCrudApi/EditRutaSitios",
                                        json
                                      );
                                      console.log("resp1", resp.data);

                                      const resp2 = await axios.post(
                                        "https://analisisderedapi.vesta-accelerate.com/api/RutaCrudApi/GetRutaById",
                                        { Id: sitio.RutaId }
                                      );
                                      console.log("resp2", resp2.data);
                                      setRutaData(resp2.data.Message);
                                      setEditingIndex(null);
                                    },
                                    {
                                      loading: "Editando sitio...",
                                      success: (resp) => {
                                        return `Sitio editado con éxito`;
                                      },
                                      error: (err) => {
                                        console.log(err);
                                        setEditingIndex(null);
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
                          <div className="mb-2 d-flex align-items-center">
                            <span style={{ width: "80px", fontSize: "12px" }}>
                              DE:
                            </span>
                            <Form.Control
                              type="text"
                              defaultValue={sitio.DuracionEntrada || ""}
                              {...formEdit.register(`DuracionEntrada_${index}`)}
                              className="p-0 border-0 border-bottom"
                              style={{ fontSize: "12px", outline: "none" }}
                            />
                          </div>
                          <div className="mb-2 d-flex align-items-center">
                            <span style={{ width: "80px", fontSize: "12px" }}>
                              DS:
                            </span>
                            <Form.Control
                              type="text"
                              defaultValue={sitio.DuracionSalida || ""}
                              {...formEdit.register(`DuracionSalida_${index}`)}
                              className="p-0 border-0 border-bottom"
                              style={{ fontSize: "12px", outline: "none" }}
                            />
                          </div>

                          <div className="mb-2 d-flex align-items-center">
                            <span style={{ width: "80px", fontSize: "12px" }}>
                              Régimen:
                            </span>
                            <Form.Control
                              type="text"
                              defaultValue={sitio.Regimen || ""}
                              {...formEdit.register(`Regimen_${index}`)}
                              className="p-0 border-0 border-bottom"
                              style={{ fontSize: "12px" }}
                            />
                          </div>

                          <Button
                            variant="success"
                            size="sm"
                            className="mt-2"
                            type="submit">
                            Guardar
                          </Button>
                          <Button
                            onClick={() => {
                              setEditingIndex(null);
                              formEdit.reset(); // 🔄 limpia los inputs del form
                            }}
                            size="sm"
                            className="mt-2 ms-2"
                            variant="secondary">
                            Cancelar
                          </Button>
                        </Form>
                      </>
                    ) : (
                      <>
                        <Card.Text style={{ fontSize: "12px", color: "#555" }}>
                          <strong>Sitio:</strong>{" "}
                          {sitio.Sitio?.Nombre || "Sin nombre"} <br />
                          <strong>ID:</strong> {sitio.Sitio?.Id || "N/A"} <br />
                          <strong>SitioPersonaId:</strong>{" "}
                          {sitio.Sitio?.SitioPersonaId || "N/A"} <br />
                          <strong>Orden:</strong> {sitio.Orden || "N/A"} <br />
                          <strong>Régimen:</strong> {sitio.Regimen || "N/A"}
                        </Card.Text>
                        <Card.Link
                          onClick={() => handleEditClick(index)}
                          style={{ cursor: "pointer" }}>
                          Editar
                        </Card.Link>
                        <Card.Link
                          onClick={() => handleDelete(sitio)}
                          style={{ cursor: "pointer" }}>
                          Eliminar
                        </Card.Link>
                      
                      </>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            )
          )} */}
          {/* ************************************SEGMENTOS************************************ */}
          <Row>
            {/* <Row>
              <Col className="col-12 d-flex align-items-center gap-2">
                <h4 className="m-0">
                  Segmentos: {rutaData.SegmentosPorRuta.length}
                </h4>
                <ModalC ContenidoModal={<FormAggSitio />} Nombre={"Añadir"} />
              </Col>
            </Row> */}
            {/* {rutaData.SegmentosPorRuta.sort((a, b) => a.Orden - b.Orden).map(
              (segmento, index) => (
                <Col key={index} md={3} className="mb-3 mt-3">
                  <Card>
                    <Card.Body>
                      {segmentoIndex === index ? (
                        <>
                          <Form
                            onSubmit={formEditSegmento.handleSubmit(
                              async (data) => {
                                let json = {
                                  RutaId: rutaData.Id,
                                  CreatedBy:
                                    "0C3A7B92-34D7-453A-883F-24C15B24FF6A",
                                  SegmentosCorregir: [
                                    {
                                      SegmentoId:
                                        segmento.Segmento?.Id || "string",
                                      Orden: data[`Orden${index}`],
                                      Accion: 3,
                                    },
                                  ],
                                };
                                toast("¿Está seguro de editar el segmento?", {
                                  action: {
                                    label: "Editar",
                                    onClick: () => {
                                      toast.promise(
                                        async () => {
                                          const resp = await axios.post(
                                            "https://analisisderedapi.vesta-accelerate.com/api/RutaCrudApi/EditRutaSegmentos",
                                            json
                                          );
                                          console.log("resp1", resp.data);

                                          const resp2 = await axios.post(
                                            "https://analisisderedapi.vesta-accelerate.com/api/RutaCrudApi/GetRutaById",
                                            { Id: rutaData.Id }
                                          );
                                          console.log("resp2", resp2.data);
                                          setRutaData(resp2.data.Message);
                                          setSegmentoIndex(null);
                                        },
                                        {
                                          loading: "Editando sitio...",
                                          success: (resp) => {
                                            return `Sitio editado con éxito`;
                                          },
                                          error: (err) => {
                                            console.log(err);
                                            setEditingIndex(null);
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
                              }
                            )}>
                            <div className="mb-2 d-flex align-items-center">
                              <span style={{ width: "80px", fontSize: "12px" }}>
                                Orden:
                              </span>
                              <Form.Control
                                type="text"
                                defaultValue={segmento.Orden || ""}
                                {...formEditSegmento.register(`Orden${index}`)}
                                className="p-0 border-0 border-bottom"
                                style={{ fontSize: "12px" }}
                              />
                            </div>
                            <Button
                              variant="success"
                              size="sm"
                              className="mt-2"
                              type="submit">
                              Guardar
                            </Button>
                            <Button
                              onClick={() => {
                                setSegmentoIndex(null);
                                // formEdit.reset(); // 🔄 limpia los inputs del form
                              }}
                              size="sm"
                              className="mt-2 ms-2"
                              variant="secondary">
                              Cancelar
                            </Button>
                          </Form>
                        </>
                      ) : (
                        <>
                          <Card.Text
                            style={{ fontSize: "12px", color: "#555" }}>
                            {segmento.Segmento?.Sitio1?.Nombre}
                            <CgArrowRight style={{ fontSize: "12px" }} />
                            {segmento.Segmento?.Sitio2?.Nombre}
                            <br />
                            <strong>ID:</strong>
                            {segmento.Segmento?.Id} <br />
                            <strong>Sitio1Id:</strong>
                            {segmento.Segmento?.Sitio1?.Id}
                            <br />
                            <strong>Sitio2Id:</strong>
                            {segmento.Segmento?.Sitio2?.Id}
                            <br />
                            <strong>Orden:</strong> {segmento.Orden}
                            <br />
                          </Card.Text>
                          <Card.Link
                            onClick={() => handleEditSegmentoClick(index)}
                            style={{ cursor: "pointer" }}>
                            Editar
                          </Card.Link>
                          <Card.Link
                            onClick={() => handleDeleteSegmento(segmento)}
                            style={{ cursor: "pointer" }}>
                            Eliminar
                          </Card.Link>
                        </>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              )
            )} */}
          </Row>
        </Row>
      )}
    </Container>
  );
}

export default EditarRuta;

