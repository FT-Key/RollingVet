import { Link } from 'react-router-dom';
import '../css/Footer.css';
import { Col, Container, Row } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className='mt-auto footer'>
      <Container>
        <Row>
          <Col sm={12} md={4}>
            <h6>Tel: +098 7 654-321</h6>
            <h6>Dir: Arg, calle Inventada 321, Piso 0, Dpto. 0</h6>
          </Col>

          <Col sm={12} md={4}>
            <div className={'container-footer'}>
              <p className={'text-footer'}>© {new Date().getFullYear()} RollingVet. Todos los derechos reservados.</p>
              <div className={'socialLinks-footer'}>
                <Link to="/SobreMi" className={'link-footer'}>Sobre mí</Link>
                <Link to="/Contacto" className={'link-footer'}>Contacto</Link>
              </div>
              <div className={'socialLinks-footer'}>
                <Link to={'/NotFound'} className={'link-footer'}>Facebook</Link>
                <Link to={'/NotFound'} className={'link-footer'}>Twitter</Link>
                <Link to={'/NotFound'} className={'link-footer'}>Instagram</Link>
              </div>
            </div>
          </Col>

          <Col sm={12} md={4}>

          </Col>
        </Row>
      </Container>

    </footer>
  );
};

export default Footer;