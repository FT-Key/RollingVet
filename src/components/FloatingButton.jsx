// FloatingButton.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../css/FloatingButton.css'; // Asegúrate de importar el archivo CSS

const FloatingButton = () => {

  // Tu número de WhatsApp (con código de país y sin símbolos especiales)
  const phoneNumber = '5493816152377';
  // Mensaje predeterminado
  const message = 'Bienvenido a RollingVet';
  // Codifica el mensaje para que se envíe correctamente en la URL
  const encodedMessage = encodeURIComponent(message);

  // Enlace de WhatsApp
  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  return (
    <Link to="/contacto" className="floating-button" >
      <img src="/Gato.png" alt="Contáctanos" />
      <span className="tool">Contáctanos</span>
    </Link>
  );
};

export default FloatingButton;