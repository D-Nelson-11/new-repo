import { useState, useRef, useEffect } from "react";
import styles from "../../public/timeline.module.css";
import { MdDelete } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { Modal, Button, Form, Card } from "react-bootstrap";
import { toast } from "sonner";
import { set, useForm } from "react-hook-form";
import axios from "../../api/axios";
import { TimelineModalSitios } from "./ModalSitios";
import { TimelineModalSegmentos } from "./ModalSegmentos";

export function TimeLine({ items, segmentos, rutaId }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeIndexSegmento, setActiveIndexSegmento] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showModalSegmento, setShowModalSegmento] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedSegmento, setSelectedSegmento] = useState(null);
  const [editing, setEditing] = useState(false);
  const [data, setData] = useState(items); // aqui guardo los sitios, es para poder actualizar la lista al editar o eliminar
  const [segmentoData, setSegmentoData] = useState(segmentos);
  const containerRef = useRef(null);
  const formEdit = useForm();
  const formEditSegmento = useForm();
  const [editingSegmento, setEditingSegmento] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setActiveIndex(null);
        setActiveIndexSegmento(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setData(items);
  }, [items]);

  useEffect(() => {
    setSegmentoData(segmentos);
  }, [segmentos]);

  const handleToggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleToggleSegmentoIndex = (index) => {
    setActiveIndexSegmento(activeIndexSegmento === index ? null : index);
  };

  const handleShowModal = (item) => {
    setSelectedItem(item);
    setShowModal(true);
    setEditing(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedItem(null);
    formEdit.reset();
  };

  const handleShowModalSegmento = (segmento) => {
    setSelectedSegmento(segmento);
    setShowModalSegmento(true);
    setEditingSegmento(false);
  };

  const handleCloseModalSegmento = () => {
    setShowModalSegmento(false);
    setSelectedSegmento(null);
    formEditSegmento.reset();
  };

  const handleEditSubmit = async (data) => {
    let json = {
      RutaId: selectedItem.RutaId,
      CreatedBy: "0C3A7B92-34D7-453A-883F-24C15B24FF6A",
      SitiosCorregir: [
        {
          SitioId: selectedItem.SitioId,
          Regimen: data.Regimen,
          DuracionEntrada: data.DuracionEntrada,
          DuracionSalida: data.DuracionSalida,
          Accion: 3,
        },
      ],
    };

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

              const resp2 = await axios.post(
                "https://analisisderedapi.vesta-accelerate.com/api/RutaCrudApi/GetRutaById",
                { Id: selectedItem.RutaId }
              );

              setData(resp2.data.Message.SitiosPorRuta);
              setEditing(false);
            },
            {
              loading: "Editando sitio...",
              success: () => "Sitio editado con éxito",
              error: (err) => {
                console.log(err);
                return "Error de red o inesperado";
              },
              duration: 20000,
            }
          );
        },
      },
      cancel: { label: "Cancelar" },
      duration: 20000,
      position: "top-center",
    });
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
              setData(resp2.data.Message.SitiosPorRuta);
              setEditing(false);
              setShowModal(false);
            },
            {
              loading: "Eliminando sitio...",
              success: (resp) => {
                return `Sitio eliminado con éxito`;
              },
              error: (err) => {
                console.log(err);
                setEditing(false);
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

  const handleEditSubmitSegmento = async (segmento) => {
    let json = {
      RutaId: rutaId,
      CreatedBy: "0C3A7B92-34D7-453A-883F-24C15B24FF6A",
      SegmentosCorregir: [
        {
          SegmentoId: selectedSegmento.Segmento.Id || "string",
          Orden: segmento.Orden,
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
                { Id: rutaId }
              );

              setSegmentoData(resp2.data.Message.SegmentosPorRuta);
              setEditingSegmento(false);
            },
            {
              loading: "Editando segmento...",
              success: (resp) => {
                setShowModalSegmento(false);
                return `Segmento editado con éxito`;
              },
              error: (err) => {
                console.log(err);
                setEditingSegmento(false);
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
    <>
      <div ref={containerRef} className={styles.timeline_container}>
        <div>
          <p
            style={{
              fontWeight: "bold",
              fontSize: "18px",
              textAlign: "center",
              backgroundColor: "lightgray",
            }}>
            Sitios
          </p>
          <div className={styles.timeline} style={{ marginTop: "40px" }}>
            {/* ************************************SEGMENTOS************************************ */}
            {data
              .sort((a, b) => a.Orden - b.Orden)
              .map((item, index) => (
                <div key={item.id ?? index} className={styles.timeline_item}>
                  <div className={styles.circle_container}>
                    <button
                      className={`${styles.circle} ${
                        item.active ? styles.active : ""
                      }`}
                      onClick={() => handleToggle(index)}>
                      {item.Orden}
                    </button>

                    {activeIndex === index && (
                      <div className={styles.actions}>
                        <FaEye
                          onClick={() => handleShowModal(item)}
                          style={{
                            fontSize: "20px",
                            color: "green",
                            cursor: "pointer",
                          }}
                          title="Ver detalles"
                        />
                        <MdDelete
                          onClick={() => handleDelete(item)}
                          style={{
                            cursor: "pointer",
                            fontSize: "20px",
                            color: "#AB4152",
                          }}
                          title="Eliminar"
                        />
                      </div>
                    )}

                    {item.Sitio?.Nombre && (
                      <div
                        className={styles.subtitle}
                        title={item.Sitio.Nombre}>
                        {item.Sitio.Nombre}
                      </div>
                    )}
                  </div>
                  {index < data.length - 1 && (
                    <div className={styles.line}></div>
                  )}
                </div>
              ))}
          </div>
        </div>

        {/* ************************************SEGMENTOS************************************ */}
        <div style={{ marginTop: "100px" }}>
          <p
            style={{
              fontWeight: "bold",
              fontSize: "18px",
              textAlign: "center",
              backgroundColor: "lightgray",
            }}>
            Segmentos
          </p>
          <div className={styles.timeline}>
            {segmentoData
              ?.sort((a, b) => a.Orden - b.Orden)
              .map((segmento, index) => (
                <div
                  key={segmento.Segmento?.Id ?? index}
                  className={styles.timeline_item}>
                  <div className={styles.circle_container}>
                    <button
                      className={`${styles.circle} ${
                        segmento.active ? styles.active : ""
                      }`}
                      onClick={() => handleToggleSegmentoIndex(index)}>
                      {segmento.Orden}
                    </button>

                    {activeIndexSegmento === index && (
                      <div className={styles.actions}>
                        <FaEye
                          onClick={() => handleShowModalSegmento(segmento)}
                          style={{
                            fontSize: "20px",
                            color: "green",
                            cursor: "pointer",
                          }}
                          title="Ver detalles"
                        />
                        <MdDelete
                          onClick={() => handleDeleteSegmento(segmento)}
                          style={{
                            cursor: "pointer",
                            fontSize: "20px",
                            color: "#AB4152",
                          }}
                          title="Eliminar"
                        />
                      </div>
                    )}

                    <div
                      className={styles.subtitleSegmento}
                      title={`${segmento.Segmento?.Sitio1?.Nombre || ""} → ${
                        segmento.Segmento?.Sitio2?.Nombre || ""
                      }`}>
                      <div>
                        <strong>DE:</strong> {segmento.Segmento?.Sitio1?.Nombre}
                      </div>
                      <div>
                        <strong>A:</strong> {segmento.Segmento?.Sitio2?.Nombre}
                      </div>
                    </div>
                  </div>

                  {index < segmentoData.length - 1 && (
                    <div className={styles.lineSegmento}></div>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>

      <TimelineModalSitios
        show={showModal}
        onClose={handleCloseModal}
        item={selectedItem}
        editing={editing}
        setEditing={setEditing}
        formEdit={formEdit}
        handleEditSubmit={handleEditSubmit}
      />

      <TimelineModalSegmentos
        show={showModalSegmento}
        onClose={handleCloseModalSegmento}
        segmento={selectedSegmento}
        editing={editingSegmento}
        setEditing={setEditingSegmento}
        formEditSegmento={formEditSegmento}
        handleEditSubmitSegmento={handleEditSubmitSegmento}
      />
    </>
  );
}
