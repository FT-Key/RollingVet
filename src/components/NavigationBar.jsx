import React from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // Importa Link
import logo from '../assets/logo.svg'; // Importa el logo

function NavigationBar() {
  return (
    <Navbar bg="light" expand="lg">
      <Link className='nav-brand ps-2' to="/">
        <img src={logo} alt="logo" />
      </Link>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link className='ps-2' as={Link} to="/">Inicio</Nav.Link>
          <Nav.Link className='ps-2' as={Link} to="/inicioSesion">Iniciar Sesión</Nav.Link>
          <Nav.Link className='ps-2' as={Link} to="/registro">Registrarse</Nav.Link>
          <NavDropdown className='ps-2' title="Dropdown" id="basic-nav-dropdown">
            <NavDropdown.Item as={Link} to="/Servers">Servers</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/adminUsers">Admin Usuarios</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/adminProducts">Admin Productos</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/favoritos">Favoritos</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/carrito">Carrito</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/NotFound">404 Not Found</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item as={Link} to="/NotFound">404 Not Found</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavigationBar;