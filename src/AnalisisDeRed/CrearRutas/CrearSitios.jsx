import React from 'react'
import { Form } from 'react-bootstrap'
import SitioCliente from '../../Persona/Sitios/SitioCliente';
import { useState } from 'react';
import SitioAnalisis from '../../Persona/Sitios/SitiosAR';


function CrearSitios() {
    let [tipoSitio, setTipoSitio] = useState("");
  return (
    <div className='w-100'>
        <select onChange={(e)=>{setTipoSitio(e.target.value)}} className="form-select mb-3">
            <option value="">--Seleccione--</option>
            <option value="sitioPersona">Sitio persona</option>
            <option value="sitioAnalisis">Sitio Analisis de red</option>
        </select>
        {tipoSitio === "sitioPersona" && <SitioCliente/>}
        {tipoSitio === "sitioAnalisis" && <SitioAnalisis/>}
    </div>
  )
}

export default CrearSitios