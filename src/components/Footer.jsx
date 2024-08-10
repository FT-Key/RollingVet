const Footer = () => {
  return (
    <footer className='mt-auto' style={styles.footer}>
      <div style={styles.container}>
        <p style={styles.text}>© {new Date().getFullYear()} Mi Aplicación. Todos los derechos reservados.</p>
        <div style={styles.socialLinks}>
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" style={styles.link}>Facebook</a>
          <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" style={styles.link}>Twitter</a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" style={styles.link}>Instagram</a>
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: '#282c34',
    color: '#ffffff',
    padding: '20px 0',
    textAlign: 'center',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
  },
  text: {
    margin: '0',
    fontSize: '14px',
  },
  socialLinks: {
    marginTop: '10px',
  },
  link: {
    color: '#ffffff',
    margin: '0 10px',
    textDecoration: 'none',
    fontSize: '16px',
  },
};

export default Footer;