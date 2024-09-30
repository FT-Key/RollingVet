// FloatingButton.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../css/FloatingButton.css'; // Asegúrate de importar el archivo CSS

const FloatingButton = () => {
  return (
    <Link to="/contacto" className="floating-button" >
      <div className='img-container-floating'>
      <img src="https://res.cloudinary.com/duic1bovf/image/upload/v1727727284/floating-button-gif_xty2r1.gif" alt="Contáctanos" />
      </div>
      <span className="tool">Contáctanos</span>
    </Link>
  );
};

export default FloatingButton;