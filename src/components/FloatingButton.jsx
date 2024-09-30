// FloatingButton.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../css/FloatingButton.css'; // Asegúrate de importar el archivo CSS

const FloatingButton = () => {
  return (
    <Link to="/contacto" className="floating-button">
      <img src="/Gato.png" alt="Contáctanos" />
      <span className="tool">Contáctanos</span>
    </Link>
  );
};

export default FloatingButton;