import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Outlet } from "react-router-dom";
import image from '../public/image.png'; // Adjust the path as necessary
import { colors } from "../theme/colors";

export function OtherUserNav() {
  return (
    <>
      <Navbar style={{ backgroundColor: colors.colorAzulGeneral }} data-bs-theme="dark">
        <Navbar.Brand href="/new-repo/#/ModificarSitioVesta" className="text-white">
          <img src={image} alt="Logo" style={{ height: "30px" }} />
        </Navbar.Brand>
      </Navbar>
      <Outlet />
    </>
  );
}


