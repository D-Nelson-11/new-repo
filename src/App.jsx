import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Nav from "./components/Nav"; // este puede quedarse porque probablemente siempre se carga

// Lazy-loaded components
const IndexAR = lazy(() => import("./AnalisisDeRed/Index"));
const IndexP = lazy(() => import("./Persona/Index.jsx"));
const Intransit = lazy(() => import("./Persona/Intransit/Intransit.jsx"));
const Matriz = lazy(() => import("./Matriz/Matriz.jsx"));
const Sku = lazy(() => import("./SKU/Sku.jsx"));
const IndexSku = lazy(() => import("./SKU/IndexSku.jsx"));
const CrearRutas = lazy(() => import("./AnalisisDeRed/CrearRutas/CrearRutas.jsx"));
const CFO = lazy(() => import("./CFO/Index.jsx"));
const ValidarRutas = lazy(() => import("./AnalisisDeRed/validar/ValidarRutas.jsx"));
const Mediciones = lazy(() => import("./Mediciones/Mediciones.jsx"));

function App() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <Routes>
        <Route element={<Nav />}>
          <Route path="/" element={<IndexAR />} />
          <Route path="/AnalisisDeRed" element={<IndexAR />} />
          <Route path="/Personas" element={<IndexP />} />
          <Route path="/Intransit" element={<Intransit />} />
          <Route path="/Matriz" element={<Matriz />} />
          <Route path="/Sku" element={<IndexSku />} />
          <Route path="/Rutas" element={<CrearRutas />} />
          <Route path="/Cfo" element={<CFO />} />
          <Route path="/validarR" element={<ValidarRutas />} />
          <Route path="/Prueba" element={<Mediciones />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
