const Imagen = ({ url, alt, style, loading = false }) => {
    return (
      <img 
        loading={loading ? 'lazy' : undefined}
        className='d-block w-100' 
        src={url} 
        alt={alt} 
        style={style}
      />
    );
  };
  
  export default Imagen;
  