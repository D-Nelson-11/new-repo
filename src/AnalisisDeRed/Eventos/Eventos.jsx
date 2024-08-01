import React from "react";
import { useState, useEffect } from "react";
import * as xlsx from 'xlsx';


function Eventos() {
    const [rowData, setRowData] = useState([]);

    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = xlsx.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
        
        console.log("Datos JSON completos:", jsonData); // Depuración
  
        // Extraer las primeras 12 columnas y 10 filas de cada columna
        const columnCount = 12;
        const rowCount = 10;
        const rowData = jsonData.slice(1, rowCount).map((row, rowIndex) => {
          const rowObject = {};
          for (let colIndex = 0; colIndex < columnCount; colIndex++) {
            // Asignar la celda a un nombre de columna genérico (A, B, C, etc.)
            const colName = String.fromCharCode(65 + colIndex); // 65 es el código ASCII para 'A'
            rowObject[colName] = row[colIndex] !== undefined ? row[colIndex] : null;
          }
          return rowObject;
        });
  
        setRowData(rowData);
      };
  
      reader.readAsArrayBuffer(file);
    };
  
    return (
      <div>
        <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
        <pre>
          {JSON.stringify(rowData, null, 2)}
        </pre>
      </div>
    );
}

export default Eventos;
