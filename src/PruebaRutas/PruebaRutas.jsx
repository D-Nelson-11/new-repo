import React, { useState } from "react";
import * as XLSX from "xlsx";

function PruebaRutas() {
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    const rutasJson = [];

    reader.onload = (event) => {
      const arrayBuffer = event.target.result;
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      for (let i = 2; i < data.length; ) {
        let nombreRuta = "";
        let sitiosAnalisis = [];
        let segmentos = [];
        let jsonRutasSimples = {};

        if (data[i][2] === "SIMPLE") {
          nombreRuta = data[i + 2][2] + "/" + data[i + 2][4];
          sitiosAnalisis.push(data[i + 4][2], data[i + 4][4]);
          segmentos.push(data[i + 5][2], data[i + 5][4]);

          // Validaciones para sitios y segmentos adicionales
          if (data[i + 2][6] !== undefined) {
            nombreRuta += "/" + data[i + 2][6];
            sitiosAnalisis.push(data[i + 4][6]);
            if (data[i + 5][6] !== undefined) {
              segmentos.push(data[i + 5][6]);
            }
          }
          if (data[i + 2][8] !== undefined) {
            nombreRuta += "/" + data[i + 2][8];
            sitiosAnalisis.push(data[i + 4][8]);
            if (data[i + 5][8] !== undefined) {
              segmentos.push(data[i + 5][8]);
            }
          }
          if (data[i + 2][10] !== undefined) {
            nombreRuta += "/" + data[i + 2][10];
            sitiosAnalisis.push(data[i + 4][10]);
            if (data[i + 5][10] !== undefined) {
              segmentos.push(data[i + 5][10]);
            }
          }
          jsonRutasSimples.TipoDeclaracionId = 6;
          jsonRutasSimples.NombreRuta = nombreRuta;
          jsonRutasSimples.Sitios = sitiosAnalisis.map((sitio) => ({
            Id: sitio,
            Regimen: "N/A",
            DuracionEntrada: 0,
            DuracionSalida: 0,
            SitioJump: false,
          }));
          jsonRutasSimples.Segmentos = segmentos.map((segmento, index) => ({
            Id: segmento,
            Orden: index + 1,
          }));
          jsonRutasSimples.RutaCompuesta = [null];
          jsonRutasSimples.CreatedBy = data[2][0];
          jsonRutasSimples.ClienteId = data[0][1];
          jsonRutasSimples.ClienteNombre = data[1][1];
          jsonRutasSimples.Doccertificado = true;
          jsonRutasSimples.AforoRuta = true;
          jsonRutasSimples.TotalGalones = 0;
          jsonRutasSimples.PorcentajeDesviacion = 0;
          jsonRutasSimples.Clasificacion = "string";

          rutasJson.push(jsonRutasSimples);
        }else{
            alert("Papa, no estas poniendo si es simple o compuesta en la fila" + (i+1) + " " + "columna C, arregla esa onda y probá otra vez")
            return;
        }

        i += 7;
      }

      const contenido = rutasJson
        .map((ruta) => JSON.stringify(ruta, null, 2))
        .join("\n******************************************************************\n");
      const blob = new Blob([contenido], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "rutas.json";
      link.click();
      URL.revokeObjectURL(url);
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div style={{width:"50%", margin:"200px auto", border:"2px solid #bdbdbd",padding:"50px", borderRadius:"3px"}}>
      <h2>Ingresá el archivo excel chele</h2>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
    </div>
  );
}

export default PruebaRutas;
