import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Nav from "./components/Nav"; // este puede quedarse porque probablemente siempre se carga
import { Toaster } from "sonner";
import { OtherUserNav } from "./components/OtherUserNav.jsx";

// Lazy-loaded components
const IndexAR = lazy(() => import("./AnalisisDeRed/Index"));
const IndexP = lazy(() => import("./Persona/Index.jsx"));
const Intransit = lazy(() => import("./Persona/Intransit/Intransit.jsx"));
const Matriz = lazy(() => import("./Matriz/Matriz.jsx"));
const Sku = lazy(() => import("./SKU/Sku.jsx"));
const IndexSku = lazy(() => import("./SKU/IndexSku.jsx"));
const CrearRutas = lazy(() =>import("./AnalisisDeRed/CrearRutas/CrearRutas.jsx"));
const CFO = lazy(() => import("./CFO/Index.jsx"));
const Mediciones = lazy(() => import("./Mediciones/Mediciones.jsx"));
const ModificarSitioVesta = lazy(() => import("./Persona/sitioVesta/ModificarSitioVesta.jsx"));
const LogTable = lazy(() => import("./AnalisisDeRed/LogsAr/LogsAr.jsx"));
const Tab = lazy(() => import("./AnalisisDeRed/CrearRutas/Tab.jsx"));
const CrearProveedor = lazy(() => import("./Persona/Proveedor/CrearProveedor.jsx"));

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
          <Route path="/Rutas" element={<Tab />} />
          <Route path="/Cfo" element={<CFO />} />
          <Route path="/Prueba" element={<Mediciones />} />
          <Route path="/CrearProveedor" element={<CrearProveedor />} />
        </Route>
        <Route element={<OtherUserNav />}>
          <Route path="/ModificarSitioVesta" element={<ModificarSitioVesta />} />
          <Route path="/LogsAr" element={<LogTable />} />
        </Route>
      </Routes>

      <Toaster
        position="top-center"
        richColors
        duration={4000}
        closeButton
        toastOptions={{
          style: {
            fontSize: "15px",
          },
        }}
      />
    </Suspense>
  );
}

export default App;
