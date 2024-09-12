import React from "react";
import { Routes, Route } from "react-router-dom";
import Nav from "./components/Nav";
import IndexAR from "./AnalisisDeRed/Index";
import IndexP from "./Persona/Index.jsx";
import Intransit from "./Persona/Intransit/Intransit.jsx";
import Matriz from "./Matriz/Matriz.jsx";

function App() {
  return (
    <Routes>
      <Route element={<Nav/>}>
        <Route path="/" element={<IndexAR />} />
        <Route path="/AnalisisDeRed" element={<IndexAR />} />
        <Route path="/Personas" element={<IndexP />} />
        <Route path="/Intransit" element={<Intransit />} />
        <Route path="/Matriz" element={<Matriz />} />

      </Route>
    </Routes>
  );
}
export default App;
