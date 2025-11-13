import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { useState, useEffect } from "react";
import { MdModeEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import axios from "../api/axios";
import { toast } from "sonner";
import ModalC from "../components/ModalC";

export default function Tabla({ rows, columns, titulo, ContenidoModalEditar }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(100);
  const [expandedRowId, setExpandedRowId] = React.useState(null);
  const [rowsData, setData] = useState(rows);

  useEffect(() => {
    setData(rows);
  }, [rows]);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleRowClick = (rowId, rowData) => {
    if (rowData.RutaCompuesta?.length > 0) {
      setExpandedRowId(expandedRowId === rowId ? null : rowId);
    }
  };

  const handleDelete = async (material) => {
    try {
      console.log(material);
      if (material.IdMatValor) {
        toast("¿Desea eliminar el material del componente?", {
          action: {
            label: "Eliminar",
            onClick: () => {
              toast.promise(
                async () => {
                  if (material.IdMatValor) {
                    const response = await axios.delete(
                      `http://localhost:4000/api/deleteMaterialFlatFromComponente/${material.IdMatValor}`
                    );
                  } else {
                    let response = await axios.delete(
                      `/deleteMaterialFromComponente/${material.MaterialVariableValorId}`
                    );
                  }
                  const dataActualizada = await axios.get(
                    `http://localhost:4000/api/deleteMaterialVariableFromComponente/${material.ComponenteId}`
                  );
                  console.log(dataActualizada.data);
                  return dataActualizada.data[0];
                },
                {
                  loading: "Eliminando...",
                  success: (data) => {
                    setData(data);
                    return `Material eliminado correctamente.`;
                  },
                  error: (error) => {
                    console.log(error);
                    return `Error al eliminar el material.`;
                  },
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
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <p style={{ textAlign: "center" }}>{titulo}</p>
        <TableContainer sx={{ maxHeight: 300 }}>
          <Table
            stickyHeader
            aria-label="sticky table"
            sx={{
              "& tbody tr:nth-of-type(odd)": {
                backgroundColor: "#F0F0F0", // color para filas impares
              },
              "& tbody td": {
                fontSize: "11px",
              },
              "& thead th": {
                backgroundColor: "#4a5a85", // azul MUI
                padding: 1,
                color: "#fff", // texto blanco
                textAlign: "left", // alinear a la izquierda
              },
              boxShadow: "0px 10px 5px rgba(0, 0,0, 1)",
            }}>
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
              {rowsData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <React.Fragment key={`${row.Id} ${Math.random()}`}>
                    <TableRow
                      hover
                      tabIndex={-1}
                      onClick={() => handleRowClick(row.Id, row)}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            sx={{ padding: 1 }}>
                            {column.format && typeof value === "number"
                              ? column.format(value)
                              : value}
                            {column.id === "Opciones" && (
                              <>
                                {/* <MdModeEdit
                                  style={{
                                    fontSize: "20px",
                                    color: "green",
                                    cursor: "pointer",
                                  }}
                                  title="editar"
                                /> */}
                                <ModalC
                                  ContenidoModal={ContenidoModalEditar(row, setData)}
                                  Nombre="Editar"
                                />

                                <MdDelete
                                  style={{
                                    fontSize: "20px",
                                    color: "#AB4152",
                                    cursor: "pointer",
                                  }}
                                  title="eliminar"
                                  onClick={() => handleDelete(row)}
                                />
                              </>
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                    {/* {expandedRowId === row.Id &&
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
                      )} */}
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
          labelRowsPerPage="Filas por página:"
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  );
}
