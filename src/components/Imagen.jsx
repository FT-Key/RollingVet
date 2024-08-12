const Imagen = ({ url, alt, style, loading = false }) => {
    return (
      <img 
        loading={loading ? 'lazy' : undefined}
        className='d-block' 
        src={url} 
        alt={alt} 
        style={style}
      />
    );
  };
  
  export default Imagen;
  