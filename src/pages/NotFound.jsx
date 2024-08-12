import React from 'react';
import { Link } from 'react-router-dom';
import '../css/NotFound.css';

const NotFound = () => {
  return (
    <div className={'container-NF'}>
      <h1 className={'title-NF'}>404 - Página No Encontrada</h1>
      <p className={'message-NF'}>Lo sentimos, la página que buscas no existe.</p>
      <Link to="/" className={'link-NF'}>Volver a la página de inicio</Link>
    </div>
  );
};

export default NotFound;
