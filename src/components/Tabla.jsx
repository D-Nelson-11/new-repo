import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Button, Modal } from "react-bootstrap";
import axios from "../api/axios";

const columns = [
  { id: "Id", label: "Id", minWidth: 100 },
  { id: "NombreRuta", label: "Nombre", minWidth: 100 },
  { id: "Categoría", label: "Categoría", minWidth: 120 },
  { id: "Eventos", label: "Eventos", minWidth: 120 },
  { id: "Alertas", label: "Alertas", minWidth: 120 },
];

function EventosModal({ Nombre, row }) {
  const [lgShow, setLgShow] = React.useState(false);
  const [eventos, setEventos] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (lgShow) {
      const obtenerEventos = async () => {
        setLoading(true);
        try {
          const res = await axios.post(
            "https://analisisderedapi.vesta-accelerate.com/api/RutaCategoriaCrudApi/GetRutaCaregoriasPorRutaId",
            { RutaId: [row.Id] }
          );
          setEventos(res.data[0].Categoria);
          console.log(res.data);
        } catch (err) {
          console.error("Error al obtener eventos", err);
        } finally {
          setLoading(false);
        }
      };
      obtenerEventos();
    }
  }, [lgShow, row.Id]);

  return (
    <>
      <Button
        onClick={() => setLgShow(true)}
        style={{ backgroundColor: "#4375b4", border: "none" }}>
        {Nombre}
      </Button>
      <Modal
        size="xs"
        show={lgShow}
        onHide={() => setLgShow(false)}
        aria-labelledby="example-modal-sizes-title-lg">
        <Modal.Header closeButton />
        <Modal.Body style={{ height: "630px", overflowY: "auto" }}>
          <div className="card bg-light text-center mb-4">
            <div className="card-body p-3">
              <strong style={{ fontSize: "12px" }}>{row.NombreRuta}</strong>
            </div>
          </div>
          {loading ? (
            <p>Cargando eventos...</p>
          ) : eventos.length > 0 ? (
            <div className="card shadow-sm">
              <div className="card-body">
                <p className="card-title text-center mb-1 fw-bolder">Categorías:</p>
                <ul style={{fontSize: "12px"}}>
                  {eventos.map((evento, idx) => (
                    <li key={idx}>
                      {evento.Categoria.Observacion}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <p>No se encontraron eventos.</p>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default function Tabla({ data }) {
  const [rows, setRows] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [expandedRowId, setExpandedRowId] = React.useState(null);

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

  if (rows.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center h-100">
        <h3>Cargando...</h3>
      </div>
    );
  }

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
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
                    onClick={() => handleRowClick(row.Id, row)}
                    style={{
                      backgroundColor:
                        row.RutaCompuesta?.length === 0 ? "white" : "#8fbadc",
                      cursor: "pointer",
                    }}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} sx={{ padding: 1 }}>
                          {column.id === "Eventos" ? (
                            <EventosModal Nombre="Eventos" row={row} />
                          ) : column.id === "Categoría" ? (
                            <EventosModal Nombre="Categoría" row={row} />
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
  );
}
