import React from "react";
import { Routes, Route } from "react-router-dom";
import Nav from "./components/Nav";
import IndexAR from "./AnalisisDeRed/Index";
import IndexP from "./Persona/Index.jsx";

function App() {
  return (
    <Routes>
      <Route element={<Nav/>}>
        <Route path="/" element={<IndexAR />} />
        <Route path="/new-repo/AnalisisDeRed" element={<IndexAR />} />
        <Route path="/new-repo/Personas" element={<IndexP />} />
      </Route>
    </Routes>
  );
}

// {
//   "Esquemas": [
//     {
//       "EsquemaId": "BE237A0F-39AE-4AA2-A54A-164158601631",
//       "SitioPorRutaId": "1EC069FC-89C1-4E3C-8C11-24C13F0B36CB",
//       "Orden": 1,
//       "ClienteId": "8092E57D-03A5-44D3-B271-0F27EBF3D818",
//       "ClienteNombre": "CORPORACION DINANT SA DE CV",
//       "Descripcion": "Inicio de Tramitador ",
//       "Requerido": true,
//       "UsuarioId": "0C3A7B92-34D7-453A-883F-24C15B24FF6A",
//       "EsquemaTramitador": true,
//       "TipoEventoId": ""
//     },
//     {
//       "EsquemaId": "4D708BF5-9D3E-48E9-AB7C-14F5B438B360",
//       "SitioPorRutaId": "1EC069FC-89C1-4E3C-8C11-24C13F0B36CB",
//       "Orden": 2,
//       "ClienteId": "8092E57D-03A5-44D3-B271-0F27EBF3D818",
//       "ClienteNombre": "CORPORACION DINANT SA DE CV",
//       "Descripcion": "Presentación",
//       "Requerido": true,
//       "UsuarioId": "0C3A7B92-34D7-453A-883F-24C15B24FF6A",
//       "EsquemaTramitador": false,
//       "TipoEventoId": ""
//     },
//     {
//         "EsquemaId": "D95046C5-F686-4395-87CC-14F5B68FEDBE",
//         "SitioPorRutaId": "1EC069FC-89C1-4E3C-8C11-24C13F0B36CB",
//         "Orden": 3,
//         "ClienteId": "8092E57D-03A5-44D3-B271-0F27EBF3D818",
//         "ClienteNombre": "CORPORACION DINANT SA DE CV",
//         "Descripcion": "Revision",
//         "Requerido": true,
//         "UsuarioId": "0C3A7B92-34D7-453A-883F-24C15B24FF6A",
//         "EsquemaTramitador": false,
//         "TipoEventoId": ""
//       },
//     {
//       "EsquemaId": "694153C9-869E-4127-AE18-220714274189",
//       "SitioPorRutaId": "1EC069FC-89C1-4E3C-8C11-24C13F0B36CB",
//       "Orden": 4,
//       "ClienteId": "8092E57D-03A5-44D3-B271-0F27EBF3D818",
//       "ClienteNombre": "CORPORACION DINANT SA DE CV",
//       "Descripcion": "Diagnostico de Plaga",
//       "Requerido": true,
//       "UsuarioId": "0C3A7B92-34D7-453A-883F-24C15B24FF6A",
//       "EsquemaTramitador": false,
//       "TipoEventoId": ""
//     },
//     {
//       "EsquemaId": "E8011FF9-F253-4831-BD72-22096517CBB0",
//       "SitioPorRutaId": "1EC069FC-89C1-4E3C-8C11-24C13F0B36CB",
//       "Orden": 5,
//       "ClienteId": "8092E57D-03A5-44D3-B271-0F27EBF3D818",
//       "ClienteNombre": "CORPORACION DINANT SA DE CV",
//       "Descripcion": "Fumigación",
//       "Requerido": true,
//       "UsuarioId": "0C3A7B92-34D7-453A-883F-24C15B24FF6A",
//       "EsquemaTramitador": false,
//       "TipoEventoId": ""
//     },
//     {
//       "EsquemaId": "1B894327-01DE-4F3D-ABB5-1641544D66E0",
//       "SitioPorRutaId": "1EC069FC-89C1-4E3C-8C11-24C13F0B36CB",
//       "Orden": 6,
//       "ClienteId": "8092E57D-03A5-44D3-B271-0F27EBF3D818",
//       "ClienteNombre": "CORPORACION DINANT SA DE CV",
//       "Descripcion": "Liberacion Post Revision",
//       "Requerido": true,
//       "UsuarioId": "0C3A7B92-34D7-453A-883F-24C15B24FF6A",
//       "EsquemaTramitador": false,
//       "TipoEventoId": ""
//     },
//     {
//       "EsquemaId": "ADD1E48B-03C6-44FB-9E9A-14F5BDA29BBE",
//       "SitioPorRutaId": "1EC069FC-89C1-4E3C-8C11-24C13F0B36CB",
//       "Orden": 7,
//       "ClienteId": "8092E57D-03A5-44D3-B271-0F27EBF3D818",
//       "ClienteNombre": "CORPORACION DINANT SA DE CV",
//       "Descripcion": "Despacho",
//       "Requerido": true,
//       "UsuarioId": "0C3A7B92-34D7-453A-883F-24C15B24FF6A",
//       "EsquemaTramitador": false,
//       "TipoEventoId": ""
//     }
//   ]
// }

export default App;
