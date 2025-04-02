import React, { useState } from "react";
import * as XLSX from "xlsx";
import { regimenes } from "./json";

function PruebaRutas() {
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    const rutasJson = [];
    let nombreRegimen = "";
    let posicionRegimen;

    reader.onload = (event) => {
      const arrayBuffer = event.target.result;
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      for (let i = 3; i < data.length; ) {
        // comienza en 2 porque ahi comienzan las rutas o sea en la fila 3 del excel
        let nombreRuta = "";
        let nombreRutaHija = "";
        let segmentosRutaHija = [];
        let sitiosAnalisisHija = [];
        let sitiosAnalisis = [];
        let segmentos = [];
        let jsonRutasSimples = {};

        if (data[i][2] === "SIMPLE") {
          //buscar el regimen en el segundo sitio
          if (data[i][4] !==undefined){
            regimenes.find((regimen) => {
              if (regimen.codigo == data[i][4]) {
                nombreRegimen = regimen.codigo + "/" + regimen.descripcion;
                posicionRegimen = 1;
              }
            });
          }
          //buscar el regimen en el tercer sitio
          if (data[i][6] !==undefined){
            regimenes.find((regimen) => {
              if (regimen.codigo == data[i][6]) {
                nombreRegimen = regimen.codigo + "/" + regimen.descripcion;
                posicionRegimen = 2;

              }
            });
          }
          //buscar el regimen en el cuarto sitio
          if (data[i][8] !==undefined){
            regimenes.find((regimen) => {
              if (regimen.codigo == data[i][8]) {
                nombreRegimen = regimen.codigo + "/" + regimen.descripcion;
                posicionRegimen = 3;
              }
            });
          }

            //buscar el regimen en el quinto sitio
            if (data[i][10] !==undefined){
              regimenes.find((regimen) => {
                if (regimen.codigo == data[i][10]) {
                  nombreRegimen = regimen.codigo + "/" + regimen.descripcion;
                  posicionRegimen = 4;
                }
              });
            }

            //buscar el regimen en el sexto sitio
            if (data[i][12] !==undefined){
              regimenes.find((regimen) => {
                if (regimen.codigo == data[i][12]) {
                  nombreRegimen = regimen.codigo + "/" + regimen.descripcion;
                  posicionRegimen = 5;
                }
              }); 
            }

          nombreRuta = data[i + 2][2] + "/" + data[i + 2][4]; //i+2 es la fila donde estan los nombres de los sitios
          sitiosAnalisis.push(data[i + 4][2], data[i + 4][4]); //i+4 es la fila donde estan los ids de analisis de red
          segmentos.push(data[i + 5][2], data[i + 5][4]); // i+5 es la fila donde estan los ids de segmentos

          // Validaciones para sitios y segmentos adicionales
          if (data[i + 2][6] !== undefined) { // si hay un tercer sitio
            nombreRuta += "/" + data[i + 2][6];
            sitiosAnalisis.push(data[i + 4][6]);
            if (data[i + 5][6] !== undefined) {
              segmentos.push(data[i + 5][6]);
            }
          }
          if (data[i + 2][8] !== undefined) { // si hay un cuarto sitio
            nombreRuta += "/" + data[i + 2][8];
            sitiosAnalisis.push(data[i + 4][8]);
            if (data[i + 5][8] !== undefined) {
              segmentos.push(data[i + 5][8]);
            }
          }
          if (data[i + 2][10] !== undefined) { // si hay un quinto sitio
            nombreRuta += "/" + data[i + 2][10];
            sitiosAnalisis.push(data[i + 4][10]);
            if (data[i + 5][10] !== undefined) {
              segmentos.push(data[i + 5][10]);
            }
          }
          if (data[i + 2][12] !== undefined) { // si hay un sexto sitio
            nombreRuta += "/" + data[i + 2][12];
            sitiosAnalisis.push(data[i + 4][12]);
            if (data[i + 5][12] !== undefined) {
              segmentos.push(data[i + 5][12]);
            }
          }

          if (data[i + 2][14] !== undefined) { // si hay un septimo sitio
            nombreRuta += "/" + data[i + 2][14];
            sitiosAnalisis.push(data[i + 4][14]);
            if (data[i + 5][14] !== undefined) {
              segmentos.push(data[i + 5][14]);
            }
          }
          jsonRutasSimples.TipoDeclaracionId = 6;
          jsonRutasSimples.NombreRuta = nombreRuta;
          jsonRutasSimples.Sitios = sitiosAnalisis.map((sitio, index) => ({
            Id: sitio,
            Regimen: index == posicionRegimen ? nombreRegimen : "N/A",
            DuracionEntrada: 50,
            DuracionSalida: 50,
            SitioJump: false,
          }));
          jsonRutasSimples.Segmentos = segmentos.map((segmento, index) => ({
            Id: segmento,
            Orden: index + 1,
          }));
          jsonRutasSimples.LineaProducto = 'Inbound';
          jsonRutasSimples.RutaCompuesta = [];
          jsonRutasSimples.CreatedBy = data[2][0]; // fila 3 columna A
          jsonRutasSimples.ClienteId = data[0][1]; // fila 1 columna B
          jsonRutasSimples.ClienteNombre = data[1][1]; // fila 2 columna B
          jsonRutasSimples.Doccertificado = false;
          jsonRutasSimples.AforoRuta = true;
          jsonRutasSimples.Clasificacion = "IB/PT";

          rutasJson.push(jsonRutasSimples);
        } else if (data[i][2] === "COMPUESTA") {
          nombreRuta = data[i + 2][2] + "/" + data[i + 2][4];
          sitiosAnalisis.push(data[i + 4][2], data[i + 4][4]);
          segmentos.push(data[i + 5][2], data[i + 5][4]);

          if (data[i][6] === undefined && data[i][8] === undefined) {
            alert('La ruta compuesta debe tener al menos un corte');
            return;
          }
          if (data[i][6] === "CORTE") { // si hay corte en el tercer sitio
              nombreRuta += "/" + data[i + 2][6]; // se agrega el nombre de sitio del corte
              sitiosAnalisis.push(data[i + 4][6]); // se agrega el id de analisis del corte

              nombreRuta += "/" +  data[i + 2][8]; // despues del corte tiene que haber un sitio, entonces se agrega
              nombreRutaHija = data[i + 2][6];
              nombreRutaHija += "/" + data[i + 2][8];
              //agrego a la ruta hija el id analisis del corte y el id analisis del sitio siguiente
              sitiosAnalisisHija.push(data[i + 4][6]);
              sitiosAnalisisHija.push(data[i + 4][8]);
              //agrego a la ruta hija el segmento del corte y el segmento del sitio siguiente
              segmentosRutaHija.push(data[i + 5][6]);
              if (data[i+2][10] !== undefined) { // si hay un quinto sitio, después puedo poner mas sitios
                nombreRuta += "/" + data[i + 2][10];
                nombreRutaHija += "/" + data[i + 2][10];
                sitiosAnalisisHija.push(data[i + 4][10]);
                segmentosRutaHija.push(data[i + 5][10]);
              }
          }

          if (data[i][8] === "CORTE") { // si hay corte
            nombreRuta += "/" + data[i + 2][6]; // se agrega el nombre de sitio antes del corte
            sitiosAnalisis.push(data[i + 4][6]); // se agrega el id de analisis antes del corte
            segmentos.push(data[i + 5][6]); // se agrega el segmento antes del corte

            nombreRuta += "/" + data[i + 2][8]; // se agrega el nombre de sitio del corte
            sitiosAnalisis.push(data[i + 4][8]); // se agrega el id de analisis del corte
            nombreRuta += "/" + data[i + 2][10]; // se agrega el nombre de sitio del siguiente corte
            nombreRutaHija = data[i + 2][8]; // se agrega el nombre de sitio del corte al nombre de la ruta hija
            nombreRutaHija += "/" + data[i + 2][10]; // se agrega el nombre de sitio del siguiente corte

            //agrego a la ruta hija el id analisis del corte y el id analisis del sitio siguiente
            sitiosAnalisisHija.push(data[i + 4][8]);
            sitiosAnalisisHija.push(data[i + 4][10]);

            //agrego a la ruta hija el segmento del corte y el segmento del sitio siguiente
            segmentosRutaHija.push(data[i + 5][8]);
            if (data[i+2][12] !== undefined) { // si hay un quinto sitio, después puedo poner mas sitios
              nombreRuta += "/" + data[i + 2][12];
              nombreRutaHija += "/" + data[i + 2][12];
              sitiosAnalisisHija.push(data[i + 4][12]);
              segmentosRutaHija.push(data[i + 5][12]);
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
          jsonRutasSimples.RutaCompuesta = [ //RUTA HIJA
            {
              TipoDeclaracionId: 0,
              NombreRuta: nombreRutaHija,
              Sitios: sitiosAnalisisHija.map((sitio) => ({
                Id: sitio,
                Regimen: "N/A",
                DuracionEntrada: 0,
                DuracionSalida: 0,
                SitioJump: false,
              })),
              Segmentos: segmentosRutaHija.map((segmento, index) => ({
                Id: segmento,
                Orden: index + 1,
              })),
              RutaCompuesta: [],
              CreatedBy: data[2][0], // fila 3 columna A
              ClienteId: data[0][1], // fila 1 columna B
              ClienteNombre: data[1][1], // fila 2 columna B
              Doccertificado: false,
              AforoRuta: false,
              Clasificacion: "string",
            },
          ];
          jsonRutasSimples.CreatedBy = data[2][0]; // fila 3 columna A
          jsonRutasSimples.ClienteId = data[0][1]; // fila 1 columna B
          jsonRutasSimples.ClienteNombre = data[1][1]; // fila 2 columna B
          jsonRutasSimples.Doccertificado = false;
          jsonRutasSimples.AforoRuta = false;
          jsonRutasSimples.Clasificacion = "string";

          rutasJson.push(jsonRutasSimples);
         
        } 
        i += 8;
      }

      const contenido = rutasJson
        .map((ruta) => JSON.stringify(ruta, null, 2))
        .join(
          "\n******************************************************************\n"
        );
      const blob = new Blob([contenido], { type: "application/txt" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "rutas.txt";
      link.click();
      URL.revokeObjectURL(url);
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div
      style={{
        width: "50%",
        margin: "200px auto",
        border: "2px solid #bdbdbd",
        padding: "50px",
        borderRadius: "3px",
      }}>
      <h2>Ingresá el archivo excel chele</h2>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
    </div>
  );
}

export default PruebaRutas;
