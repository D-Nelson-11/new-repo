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

export default function Tabla({ rows, columns }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(100);
  const [expandedRowId, setExpandedRowId] = React.useState(null);

  useEffect(() => {
    console.log(rows);
  }, []);

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
              boxShadow: "0px 10px 5px rgba(0, 0,0, 0.5)",
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
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <React.Fragment key={row.Id}>
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
