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
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const columns = [
  { id: "Id", label: "Id", minWidth: 100 },
  { id: "NombreRuta", label: "Nombre", minWidth: 100 },
  { id: "Categoría", label: "Categoría", minWidth: 120 },
  { id: "Eventos", label: "Eventos", minWidth: 120 },
  { id: "Alertas", label: "Alertas", minWidth: 120 },
];

export default function Tabla({ data }) {
  const [rows, setRows] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [expandedRowId, setExpandedRowId] = React.useState(null);

  const [showModal, setShowModal] = React.useState(false);
  const [eventos, setEventos] = React.useState([]);
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

  const cargarEventos = async (row) => {
    setModalTitle(`Eventos de la ruta: ${row.NombreRuta}`);    
    try {
      const res = await axios.post(
        "https://analisisderedapi.vesta-accelerate.com/api/RutaCategoriaCrudApi/GetRutaCaregoriasPorRutaId",
        { RutaId: [row.Id] }
      );
      const categorias = res.data?.[1]?.Categoria || [];
      setEventos(categorias);
      setShowModal(true);
    } catch (error) {
      console.error("Error cargando eventos", error);
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
                            {column.id === "Categoría" ? (
                              row?.Categoria?.length > 0 ? (
                                <FaCheckCircle
                                  className="text-success"
                                  style={{ cursor: "pointer" }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    cargarEventos(row);
                                  }}
                                />
                              ) : (
                                <FaTimesCircle className="text-danger" />
                              )
                            ) : column.id === "Eventos" ? (
                              <Button
                                style={{
                                  backgroundColor: "#4375b4",
                                  border: "none",
                                }}>
                                Categoría
                              </Button>
                            ) : column.id === "Alertas" ? (
                              <Button
                                style={{
                                  backgroundColor: "#4375b4",
                                  border: "none",
                                }}>
                                Alertas
                              </Button>
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

      {/* Modal de Eventos */}
      <Modal size="lg" show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {eventos.length === 0 ? (
            <div className="text-center text-danger">
              <FaTimesCircle size={50} />
              <p>No se encontraron categorías.</p>
            </div>
          ) : (
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Categorías encontradas</h5>
                <ul className="list-group list-group-flush">
                  {eventos.map((evento, idx) => (
                    <li className="list-group-item" key={idx}>
                      <strong>Nombre:</strong>{" "}
                      {evento.Nombre || "Sin nombre"}
                      <br />
                      <strong>Observación:</strong>{" "}
                      {evento.Observacion || "Sin observación"}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}