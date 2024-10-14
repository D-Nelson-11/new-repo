import { Form, Row, Col, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import axios from "../../api/axios";

function SitioCliente() {
  const { handleSubmit, register } = useForm();
  const [paises, setPaises] = useState([]);
  const [tipoDeSitio, setTipoDeSitio] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [loading, setLoading] = useState(true); // Estado de carga
  const [tipoSitio, setTipoSitio] = useState(1);
  let parsedResp = {};

  useEffect(() => {
    async function ObtenerDatos() {
      try {
        const respPaises = await axios.get(
          "http://localhost:4000/api/obtenerDatos"
        );
        setPaises(respPaises.data); // Llenar el estado de países

        const respTipoDeSitio = await axios.get(
          "https://personasapi.vesta-accelerate.com/api/TipoDeSitioCrudApi/Index"
        );
        setTipoDeSitio(respTipoDeSitio.data); // Llenar el estado de tipo de sitio

        const respCiudades = await axios.get(
          "http://localhost:4000/api/obtenerCiudades"
        );
        setCiudades(respCiudades.data); // Llenar el estado de ciudades
        setLoading(false); // Cambiar el estado de carga
      } catch (error) {
        console.error("Error al obtener los datos", error);
        setLoading(false); // Asegurarse de cambiar el estado de carga aunque ocurra un error
      }
    }

    ObtenerDatos();
  }, []); // Ejecutar solo una vez al montar el componente

  const onSubmit = async (data) => {
      if (tipoSitio == 1) {
        try {
          let json = {
            Nombre: data.Nombre,
            Direccion: data.Direccion,
            Codigo: data.Codigo,
            PaisId: data.PaisId.split(",")[0],
            PaisDescripcion: data.PaisId.split(",")[1],
            CiudadId: data.CiudadId.split(",")[0],
            CiudadDescripcion: data.CiudadId.split(",")[1],
            CoordenadaX: data.CoordenadaX,
            CoordenadaY: data.CoordenadaY,
            PersonaJuridicaClienteId: data.PersonaJuridicaClienteId,
            TipoDeSitioId: data.TipoDeSitioId.split(",")[0],
            TipoDeSitioDescripcion: data.TipoDeSitioId.split(",")[1],
            TipoPersonaDestino: "3",
          };
          const resp = await axios.post("https://personasapi.vesta-accelerate.com/api/SitioClienteServiceApi/Create",json);
          parsedResp = JSON.parse(resp.data.Message);
          alert("Sitio cliente creado correctamente");
        } catch (error) {
          alert (error);
        }
      }else if (tipoSitio == 2) {
        try {
          let json = {
            Nombre: data.Nombre,
            Direccion: data.Direccion,
            Codigo: data.Codigo,
            PaisId: data.PaisId.split(",")[0],
            PaisDescripcion: data.PaisId.split(",")[1],
            CiudadId: data.CiudadId.split(",")[0],
            CiudadDescripcion: data.CiudadId.split(",")[1],
            CoordenadaX: data.CoordenadaX,
            CoordenadaY: data.CoordenadaY,
            PersonaProveedorId: data.PersonaProveedorId,
            TipoDeSitioId: data.TipoDeSitioId.split(",")[0],
            TipoDeSitioDescripcion: data.TipoDeSitioId.split(",")[1],
            TipoPersonaDestino: "3",
          };
          console.log(json);  
          const resp = await axios.post("https://personasapi.vesta-accelerate.com/api/SitioPersonaProveedorApi/Create",json);
          parsedResp = JSON.parse(resp.data.Message);
          alert("Sitio Proveedor creado correctamente");
        } catch (error) {
          alert (error);
        }
      }else{
        try {
          let json = {
            Nombre: data.Nombre,
            Direccion: data.Direccion,
            Codigo: data.Codigo,
            PaisId: data.PaisId.split(",")[0],
            PaisDescripcion: data.PaisId.split(",")[1],
            CiudadId: data.CiudadId.split(",")[0],
            CiudadDescripcion: data.CiudadId.split(",")[1],
            CoordenadaX: data.CoordenadaX,
            CoordenadaY: data.CoordenadaY,
            PersonaJuridicaVestaId: "30d1014c-d443-42ee-8015-005fb0d9fa00",
            TipoDeSitioId: data.TipoDeSitioId.split(",")[0],
            TipoDeSitioDescripcion: data.TipoDeSitioId.split(",")[1],
            TipoPersonaDestino: "2",
          };
          console.log(json);  
          const resp = await axios.post("https://personasapi.vesta-accelerate.com/api/SitioVestaServiceApi/Create",json);
          parsedResp = JSON.parse(resp.data.Message);
          alert("Sitio vesta creado correctamente");
        } catch (error) {
          alert (error);
        }
      }

      // let JsonSitioAr = {
      //   CoordenadaX: data.CoordenadaX,
      //   CoordenadaY: data.CoordenadaY,
      //   Nombre: data.Nombre,
      //   TipoSitioId: "string",
      //   SitioPersonaId: parsedResp.Id,
      //   CreatedBy: "0C3A7B92-34D7-453A-883F-24C15B24FF6A",
      //   ClienteId: datos.PersonaJuridicaClienteId,
      //   ClienteNombre: "string",
      //   PaisId: datos.PaisId.split(",")[0],
      //   PaisNombre: datos.PaisId.split(",")[1],
      //   Url: "modelologisticoderedope.vesta-accelerate.com",
      //   SitioCodigo: data.Codigo,
      //   UsuarioAsignadoId: "0C3A7B92-34D7-453A-883F-24C15B24FF6A",
      // };
  };

  if (loading) {
    return <div>Cargando...</div>; // Mostrar un indicador de carga
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Row>
        <Col>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Tipo de Sitio</Form.Label>
            <Form.Select onChange={(e)=>setTipoSitio(e.target.value)} >
              <option value="">Seleccione</option>
              <option value={1}>Cliente de vesta</option>
              <option value={2}>Proveedor del cliente de vesta</option>
              <option value={3}>Sitio de vesta</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col>
        {tipoSitio == 1 && (
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>ClienteId</Form.Label>
            <Form.Control
              type="text"
              placeholder="PersonaJuridicaClienteId"
              {...register("PersonaJuridicaClienteId")}
            />
          </Form.Group>
        )}
        {tipoSitio == 2 && (
          <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>PersonaProveedorId</Form.Label>
          <Form.Control
            type="text"
            placeholder="PersonaProveedorId"
            {...register("PersonaProveedorId")}
          />
        </Form.Group>
        )}
         {tipoSitio == 3 && (
         null
        )}
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nombre"
              {...register("Nombre")}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Direccion</Form.Label>
            <Form.Control
              type="text"
              placeholder="Direccion"
              {...register("Direccion")}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Codigo</Form.Label>
            <Form.Control
              type="text"
              placeholder="Codigo"
              {...register("Codigo")}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Pais</Form.Label>
            <Form.Select {...register("PaisId")}>
              {paises.map((pais) => (
                <option key={pais.Id} value={[pais.Id, pais.Descripcion]}>
                  {pais.Descripcion}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Coordenada X</Form.Label>
            <Form.Control
              type="text"
              placeholder="Coordenada X"
              {...register("CoordenadaX")}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Coordenada Y</Form.Label>
            <Form.Control
              type="text"
              placeholder="Coordenada Y"
              {...register("CoordenadaY")}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Tipo de sitio</Form.Label>
            <Form.Select {...register("TipoDeSitioId")}>
              {tipoDeSitio.map((tipo) => (
                <option key={tipo.Id} value={[tipo.Id, tipo.Descripcion]}>
                  {tipo.Descripcion}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Ciudad</Form.Label>
            <Form.Select {...register("CiudadId")}>
              {ciudades.map((ciudad) => (
                <option key={ciudad.Id} value={[ciudad.Id, ciudad.Descripcion]}>
                  {ciudad.Descripcion}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col>
          <Button className="w-100" type="submit">
            Enviar
          </Button>
        </Col>
      </Row>
    </Form>
  );
}

export default SitioCliente;
