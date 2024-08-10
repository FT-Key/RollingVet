import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>404 - Página No Encontrada</h1>
      <p style={styles.message}>Lo sentimos, la página que buscas no existe.</p>
      <Link to="/" style={styles.link}>Volver a la página de inicio</Link>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: '1 1 auto',
    minHeight: '50vh',
    textAlign: 'center',
    backgroundColor: '#f8f9fa',
    color: '#333',
  },
  title: {
    fontSize: '48px',
    margin: '0',
  },
  message: {
    fontSize: '24px',
    margin: '10px 0',
  },
  link: {
    fontSize: '18px',
    color: '#007bff',
    textDecoration: 'none',
  },
};

export default NotFound;
