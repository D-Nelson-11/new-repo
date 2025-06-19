import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import axios from "../api/axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { FaCheckCircle, FaTimesCircle,FaEye  } from "react-icons/fa";

const columns = [
  { id: "Id", label: "Id", minWidth: 100 },
  { id: "NombreRuta", label: "Nombre", minWidth: 100 },
  { id: "Categoría", label: "Categoría", minWidth: 120, align: "center" },
  { id: "Eventos", label: "Eventos", minWidth: 120, align: "center" },
  { id: "Alertas", label: "Alertas", minWidth: 120, align: "center" },

];

export default function Tabla({ data }) {
  const [rows, setRows] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(100);
  const [expandedRowId, setExpandedRowId] = React.useState(null);

  const [showModal, setShowModal] = React.useState(false);
  const [categorias, setCategorias] = React.useState([]);
  const [eventos, setEventos] = React.useState([]);
  const [tipoqueVaAModal, setTipoQueVaAModal] = React.useState("");
  const [modalTitle, setModalTitle] = React.useState("");

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  React.useEffect(() => {
    setRows(data);
  }, [data]);

  const handleRowClick = (rowId, rowData) => {
    if (rowData.RutaCompuesta?.length > 0) {
      setExpandedRowId(expandedRowId === rowId ? null : rowId);
    }
  };

  const cargarCategorias = async (row) => {
    setModalTitle(`Categorías de ruta: ${row.NombreRuta}`);
    try {
      const res = await axios.post(
        "https://analisisderedapi.vesta-accelerate.com/api/RutaCategoriaCrudApi/GetRutaCaregoriasPorRutaId",
        { RutaId: [row.Id] }
      );
      setTipoQueVaAModal("categorias");
      setCategorias(res.data[0]?.Categoria || []);
      setShowModal(true);
    } catch (error) {
      console.error("Error cargando eventos", error);
      setCategorias([]);
      setShowModal(true);
    }
  };

   const cargarEventos = async (row) => {
    setModalTitle(`Eventos de ruta: ${row.NombreRuta}`);
    console.log(row.Id);
    try {
      const res = await axios.post(
        "https://analisisderedapi.vesta-accelerate.com/api/RutaEventoDestinatarioCrudApi/RutaEventoDestinatarioByRutaId",
        { RutaId: row.Id }
      );
      console.log(res.data.RutaEventoDestinatarios);
      setTipoQueVaAModal("eventos");
      setEventos(res.data.RutaEventoDestinatarios || []);
      setShowModal(true);
    } catch (error) {
      console.log("Error cargando eventos", error); 
      setTipoQueVaAModal("eventos");
      setEventos([]);
      setShowModal(true);
    }
  };

  const cargarAlertas = async (row) => {
    setModalTitle(`Eventos de ruta: ${row.NombreRuta}`);
    console.log(row.Id);
    try {
      const res = await axios.post(
        "https://analisisderedapi.vesta-accelerate.com/api/RutaEventoDestinatarioCrudApi/RutaEventoDestinatarioByRutaId",
        { RutaId: row.Id }
      );
      console.log(res.data.RutaEventoDestinatarios);
      setTipoQueVaAModal("eventos");
      setEventos(res.data.RutaEventoDestinatarios || []);
      setShowModal(true);
    } catch (error) {
      console.log("Error cargando eventos", error); 
      setTipoQueVaAModal("eventos");
      setEventos([]);
      setShowModal(true);
    }
  };


  if (rows.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center h-100">
        <h3>Cargando...</h3>
      </div>
    );
  }

  return (
    <>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}>
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .filter((row) => row.RutaPadreId === null)
                .reverse()
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <React.Fragment key={row.Id}>
                    <TableRow
                      hover
                      tabIndex={-1}
                      onClick={() => handleRowClick(row.Id, row)}
                      style={{
                        backgroundColor:
                          row.RutaCompuesta?.length === 0 ? "white" : "#8fbadc",
                        cursor: "pointer",
                      }}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            sx={{ padding: 1 }}>
                            {column.id === "Categoría" ? (//***********SECCION CATEGORIA***************/
                                <FaEye
                                  style={{
                                    cursor: "pointer",
                                    fontSize: "24px",
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    cargarCategorias(row);
                                  }}
                                />
                            ) : column.id === "Eventos" ?  ( //***********SECCION EVENTOS***************/
                                     <FaEye
                                  style={{
                                    cursor: "pointer",
                                    fontSize: "24px",
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    cargarEventos(row);
                                  }}
                                />  
                            )  : column.id === "Alertas" ? (
                              <FaEye
                                  style={{
                                    cursor: "pointer",
                                    fontSize: "24px",
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    cargarAlertas(row);
                                  }}
                                />  
                            ) : (
                              value
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                    {expandedRowId === row.Id &&
                      row.RutaCompuesta?.length > 0 && (
                        <TableRow style={{ backgroundColor: "#bcddf7" }}>
                          {row.RutaCompuesta.map((detalle, index) => (
                            <React.Fragment key={index}>
                              <TableCell sx={{ padding: 1 }}>
                                {detalle.Id}
                              </TableCell>
                              <TableCell sx={{ padding: 1 }}>
                                {detalle.NombreRuta}
                              </TableCell>
                            </React.Fragment>
                          ))}
                        </TableRow>
                      )}
                  </React.Fragment>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <ModalCategorias
        show={showModal}
        onHide={() => setShowModal(false)}
        tipoDescripcion={tipoqueVaAModal === "categorias" ? "categorias" : tipoqueVaAModal === "eventos" ? "eventos" : ""}
        tipoArray={tipoqueVaAModal === "categorias" ? categorias : tipoqueVaAModal === "eventos" ? eventos : []}
        title={modalTitle}
      />
    </>
  );
}

function ModalCategorias({ show, onHide, tipoArray, tipoDescripcion, title }) {
  React.useEffect(()=>{
    console.log("Tipo Descripcion:", tipoDescripcion);
    console.log("Tipo Array:", tipoArray);  
  },[])
  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {tipoDescripcion === "categorias" && (
          <>
            {tipoArray.length === 0 ? (
              <p>No hay categorías disponibles.</p>
            ) : (
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Observación</th>
                  </tr>
                </thead>
                <tbody>
                  {tipoArray.map((categoria, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{categoria.Categoria.Observacion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}

        {tipoDescripcion === "eventos" && (
          <>
            {tipoArray.length === 0 ? (
              <p>No hay eventos disponibles.</p>
            ) : (
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Correo</th>
                    <th>Medio de Notificación</th>
                    <th>Medio Preferencia</th>
                  </tr>
                </thead>
                <tbody>
                  {tipoArray.map((evento, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{evento.Correo}</td>
                      <td>{evento.MedioNotificacion}</td>
                      <td>{evento.MedioPreferencia}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
