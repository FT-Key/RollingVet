import { useEffect, useState } from "react";
import '../css/Zoom.css';

const Zoom = ({ imageUrl }) => {
  const [aspectRatio, setAspectRatio] = useState(1); // Estado para manejar el aspect ratio

  useEffect(() => {
    const imageZoom = document.getElementById('imageZoom');
    if (!imageZoom) return;

    let zoomScale = 'contain';
    let zoomX = 0;
    let zoomY = 0;

    // Crear una nueva imagen para obtener las dimensiones
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      const { width, height } = img;
      setAspectRatio(width / height); // Actualiza el aspect ratio con las dimensiones de la imagen
    };

    imageZoom.style.backgroundImage = `url(${imageUrl})`;

    const handleMouseMove = (event) => {
      zoomX = (event.offsetX * 100) / imageZoom.offsetWidth;
      zoomY = (event.offsetY * 100) / imageZoom.offsetHeight;
      updateZoom();
    };

    const handleMouseOut = () => {
      zoomScale = 'contain';
      zoomX = 50;
      zoomY = 50;
      updateZoom();
    };

    const handleWheel = (event) => {
      event.preventDefault();
      const zoomStep = 10;

      if (zoomScale === 'contain') zoomScale = '100%';

      if (event.deltaY < 0) {
        zoomScale = (parseFloat(zoomScale) + zoomStep) + '%';
      } else {
        zoomScale = Math.max(100, parseFloat(zoomScale) - zoomStep) + '%';
      }

      updateZoom();
    };

    const updateZoom = () => {
      imageZoom.style.backgroundSize = zoomScale;
      imageZoom.style.backgroundPosition = `${zoomX}% ${zoomY}%`;
    };

    imageZoom.addEventListener('mousemove', handleMouseMove);
    imageZoom.addEventListener('mouseout', handleMouseOut);
    imageZoom.addEventListener('wheel', handleWheel);

    return () => {
      imageZoom.removeEventListener('mousemove', handleMouseMove);
      imageZoom.removeEventListener('mouseout', handleMouseOut);
      imageZoom.removeEventListener('wheel', handleWheel);
    };
  }, [imageUrl]);

  return <div id="imageZoom" style={{ aspectRatio }}></div>;
};

export default Zoom;