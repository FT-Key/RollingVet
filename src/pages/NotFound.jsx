import React from 'react';
import { Link } from 'react-router-dom';
import '../css/NotFound.css';
import { Helmet } from 'react-helmet-async';

const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>Error 404</title>
      </Helmet>
      <div className={'container-NF'}>
        <h2 className={'title-NF'}>404 - Página No Encontrada🐾</h2>
        <p className={'message-NF'}>Lo sentimos, la página que buscas no existe.</p>
        <Link to="/" className={'link-NF btn btn-primary'}>Volver a la página de inicio</Link>
      </div>
    </>
  );
};

export default NotFound;