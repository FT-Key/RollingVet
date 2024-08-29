import React from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg';
import { useAuth } from '../context/AuthContext';
import '../css/NavigationBar.css';
import SVG from './SVG';

function NavigationBar() {
  const { user, carrito, favoritos, logoutContext } = useAuth();

  const handleLogout = () => {
    logoutContext();
  };

  return (
    <Navbar bg="light" expand="lg">
      <Link className='nav-brand ps-2' to="/">
        <img src={logo} alt="logo" />
      </Link>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link className='ps-2' as={Link} to="/">Inicio</Nav.Link>
          <NavDropdown className='ps-2' title="Basics" id="basics-nav-dropdown">
            <NavDropdown.Item as={Link} to="/Servers">Servers</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/NotFound">404 Not Found</NavDropdown.Item>
            <NavDropdown.Divider />
            {user && (user.rol === 'admin' || user.rol === 'cliente') && (
              <>
                <NavDropdown.Item as={Link} to="/favoritos">Favoritos</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/carrito">Carrito</NavDropdown.Item>
              </>
            )}
          </NavDropdown>
          {user && user.rol === 'admin' && (
            <NavDropdown className='ps-2' title="Admin" id="admin-nav-dropdown">
              <NavDropdown.Item as={Link} to="/adminUsers">Admin Usuarios</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/adminProducts">Admin Productos</NavDropdown.Item>
            </NavDropdown>
          )}
          {!user && (
            <div className='contenedor-links'>
              <Nav.Link className='ps-2' as={Link} to="/inicioSesion">Iniciar Sesión</Nav.Link>
              <Nav.Link className='ps-2' as={Link} to="/registro">Registrarse</Nav.Link>
            </div>
          )}
          {user && (user.rol === 'admin' || user.rol === 'cliente') && (
            <div className='contenedor-links'>

              <abbr title="Carrito" className='abbr'>
                <Link to="/carrito" className='carrito-link'>
                  <SVG
                    name={carrito.length > 0 ? 'cart-go' : 'cart-normal'}
                    width="28px"
                    height="28px"
                    color={carrito.length > 0 ? 'green' : 'black'}
                  />
                  {carrito.length > 0 && <span className="cart-item-count">{carrito.length}</span>}
                </Link>
              </abbr>

              <abbr title="Favoritos" className='abbr'>
                <Link to="/favoritos" className='favoritos-link'>
                  <SVG
                    name={favoritos.length > 0 ? 'favs-heart-fill' : 'favs-heart-void'}
                    width="28px"
                    height="28px"
                    color={favoritos.length > 0 ? '#ff0019' : 'black'}
                  />
                  {favoritos.length > 0 && <span className="favs-item-count">{favoritos.length}</span>}
                </Link>
              </abbr>
              <Nav.Link className='ps-2 text-danger' onClick={handleLogout}>Cerrar Sesión</Nav.Link>
            </div>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavigationBar;