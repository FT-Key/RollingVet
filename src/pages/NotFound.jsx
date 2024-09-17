import React from 'react';
import { Link } from 'react-router-dom';
import '../css/NotFound.css';

const NotFound = () => {
  return (
    <div className={'container-NF'}>
      <h2 className={'title-NF'}>404 - Página No Encontrada🐾</h2>
      {/* <img className={'img-NF'} src="../../public/404NotFound.png" alt="404 Not Found" /> */}
      <p className={'message-NF'}>Lo sentimos, la página que buscas no existe.</p>
      <Link to="/" className={'link-NF btn btn-success'}>Volver a la página de inicio</Link>
    </div>
  );
};

export default NotFound;