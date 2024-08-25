import { Link } from 'react-router-dom';
import '../css/Footer.css';

const Footer = () => {
  return (
    <footer className='mt-auto footer'>
      <div className={'container-footer'}>
        <p className={'text-footer'}>© {new Date().getFullYear()} Mi Aplicación. Todos los derechos reservados.</p>
        <div className={'socialLinks-footer'}>
          <Link to="/SobreMi" className={'link-footer'}>Sobre mí</Link>
          <Link to="/Contacto" className={'link-footer'}>Contacto</Link>
        </div>
        <div className={'socialLinks-footer'}>
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className={'link-footer'}>Facebook</a>
          <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className={'link-footer'}>Twitter</a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className={'link-footer'}>Instagram</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;