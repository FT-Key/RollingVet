import React, { useEffect, useState } from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.svg';
import { useAuth } from '../context/AuthContext';
import '../css/NavigationBar.css';
import SVG from './SVG';
import { RedirectToLogin, RedirectToRegister } from '../helpers/Redirects';
import Weather from './Weather';

function NavigationBar() {
  const { user, carrito, favoritos, logoutContext } = useAuth();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false); // Estado para controlar el colapso del menú

  useEffect(() => {
    const setNavbarHeight = () => {
      const navbar = document.querySelector('.navStyle');
      if (navbar) {
        const navbarHeight = navbar.offsetHeight;
        document.documentElement.style.setProperty('--navbar-height', `${navbarHeight}px`);
      }
    };

    // Establecer altura inicial
    setNavbarHeight();

    // Actualizar altura en redimensionamiento de ventana
    window.addEventListener('resize', setNavbarHeight);

    // Limpiar el event listener al desmontar
    return () => {
      window.removeEventListener('resize', setNavbarHeight);
    };
  }, []);

  const handleLoginRedirect = () => {
    RedirectToLogin({ navigate });
    setExpanded(false); // Cerrar el menú al hacer clic
  };

  const handleRegisterRedirect = () => {
    RedirectToRegister({ navigate });
    setExpanded(false); // Cerrar el menú al hacer clic
  };

  const handleLogout = () => {
    logoutContext();
    setExpanded(false); // Cerrar el menú al hacer clic
  };

  return (
    <>
      <div className='nav-space'></div>
      <Navbar bg="light" expand="lg" expanded={expanded} onToggle={() => setExpanded(!expanded)} className='navStyle'>
        <Link className='nav-brand ps-2' to="/" onClick={() => setExpanded(false)}>
          <img src={logo} alt="logo" />
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setExpanded(!expanded)} />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link className='ps-2' as={Link} to="/" onClick={() => setExpanded(false)}>Inicio</Nav.Link>

            <NavDropdown className='ps-2' title="Clima" id="clima-nav-dropdown">
              <Weather center={true} />
            </NavDropdown>

            <NavDropdown className='ps-2' title="Basicos" id="basics-nav-dropdown">
              {user && (user.rol === 'admin' || user.rol === 'cliente') && (
                <>
                  <NavDropdown.Item as={Link} to="/turnos" onClick={() => setExpanded(false)}>Solicitar turno</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/turnos/lista" onClick={() => setExpanded(false)}>Mis turnos</NavDropdown.Item>
                </>
              )}
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} to="/NotFound" onClick={() => setExpanded(false)}>404 Not Found</NavDropdown.Item>
            </NavDropdown>

            {user && user.rol === 'admin' && (
              <NavDropdown className='ps-2' title="Admin" id="admin-nav-dropdown">
                <NavDropdown.Item as={Link} to="/adminUsers" onClick={() => setExpanded(false)}>Admin Usuarios</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/adminProducts" onClick={() => setExpanded(false)}>Admin Productos</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/adminAppointments" onClick={() => setExpanded(false)}>Admin Turnos</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/adminAnimals" onClick={() => setExpanded(false)}>Admin Animales</NavDropdown.Item>
              </NavDropdown>
            )}

            {user && (user.rol === 'admin' || user.rol === 'cliente') && (
              <>
                <Nav.Link className='ps-2' as={Link} to="/planes" onClick={() => setExpanded(false)}>Nuestros planes</Nav.Link>
                <Nav.Link className='ps-2' as={Link} to="/misMascotas" onClick={() => setExpanded(false)}>Mis mascotas</Nav.Link>
              </>
            )}

            {user
              ? (user.rol === 'admin' || user.rol === 'cliente') && (
                <div className='contenedor-links'>
                  <abbr title="Carrito" className='abbr'>
                    <Link to="/carrito" className='carrito-link' onClick={() => setExpanded(false)}>
                      <SVG
                        name={carrito.length > 0 ? 'cart-go-fill' : 'cart-normal-fill'}
                        width="42px"
                        height="42px"
                        color={carrito.length > 0 ? 'green' : 'transparent'}
                      />
                      <span className={`cart-item-count${carrito.length > 0 ? ' show-space' : ' hidden-space'}`}>{carrito.length}</span>
                    </Link>
                  </abbr>

                  <abbr title="Favoritos" className='abbr'>
                    <Link to="/favoritos" className='favoritos-link' onClick={() => setExpanded(false)}>
                      <SVG
                        name={'favs-heart-fill'}
                        width="42px"
                        height="42px"
                        color={favoritos.length > 0 ? '#ff0019' : 'transparent'}
                      />
                      <span className={`favs-item-count${favoritos.length > 0 ? ' show-space' : ' hidden-space'}`}>{favoritos.length}</span>
                    </Link>
                  </abbr>
                  <Nav.Link className='ps-2 text-danger' onClick={handleLogout}>Cerrar Sesión</Nav.Link>
                </div>
              )
              : (
                <div className='contenedor-links'>
                  <Nav.Link className='ps-2' onClick={handleLoginRedirect}>Iniciar Sesión</Nav.Link>
                  <Nav.Link className='ps-2' onClick={handleRegisterRedirect}>Registrarse</Nav.Link>
                </div>
              )
            }
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
}

export default NavigationBar;