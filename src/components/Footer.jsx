import { Link } from 'react-router-dom';
import '../css/Footer.css';
import { Col, Container, Row } from 'react-bootstrap';
import Weather from './Weather';
import MapComponent from './MapComponent';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa'; // Importar íconos

const Footer = () => {
  return (
    <footer className='mt-auto footer'>
      <Container>
        <Row className='gy-3'>
          <Col sm={12} md={4} className='d-flex flex-column justify-content-center'>
            <h6>Tel: +098 7 654-321</h6>
            <h6>Dir: Arg, calle Inventada 321, Piso 0, Dpto. 0</h6>
            <MapComponent />
          </Col>

          <Col sm={12} md={4} className='d-flex flex-column justify-content-center'>
            <div className={'container-footer'}>
              <h3 className={'text-footer'}>© {new Date().getFullYear()} RollingVet. Todos los derechos reservados.</h3>
              <div className={'socialLinks-footer'}>
                <Link to="/SobreMi" className={'link-footer'}>Sobre mí</Link>
                <Link to="/Contacto" className={'link-footer'}>Contacto</Link>
              </div>
              <div className={'socialLinks-footer'}>
                <Link to={'/NotFound'} className={'link-footer'}><FaFacebook size={24} /></Link> {/* Icono Facebook */}
                <Link to={'/NotFound'} className={'link-footer'}><FaTwitter size={24} /></Link>  {/* Icono Twitter */}
                <Link to={'/NotFound'} className={'link-footer'}><FaInstagram size={24} /></Link> {/* Icono Instagram */}
              </div>
            </div>
          </Col>

          <Col sm={12} md={4} className='d-flex flex-column justify-content-center'>
            <Weather center={true} vertical={false} />
          </Col>
        </Row>
      </Container>

    </footer>
  );
};

export default Footer;