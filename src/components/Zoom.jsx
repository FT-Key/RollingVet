import { useEffect } from "react";
import '../css/Zoom.css';

const Zoom = ({ imageUrl }) => {
  useEffect(() => {
    const imageZoom = document.getElementById('imageZoom');
    if (!imageZoom) return;

    let zoomScale = 'contain'; // Ajusta el tamaño inicial de la imagen
    let zoomX = 0;
    let zoomY = 0;

    // Establecer la URL de la imagen como fondo dinámico
    imageZoom.style.backgroundImage = `url(${imageUrl})`;

    const handleMouseMove = (event) => {
      zoomX = (event.offsetX * 100) / imageZoom.offsetWidth;
      zoomY = (event.offsetY * 100) / imageZoom.offsetHeight;
      updateZoom();
    };

    const handleMouseOut = () => {
      // Restablecer el zoom y centrar la imagen al quitar el mouse
      zoomScale = 'contain'; // Volver a ajustar la imagen a `contain` cuando el mouse sale
      zoomX = 50; // Centrar horizontalmente
      zoomY = 50; // Centrar verticalmente
      updateZoom();
    };

    const handleWheel = (event) => {
      event.preventDefault();
      const zoomStep = 10; // step for zooming in and out

      // Si el zoom es actualmente 'contain', lo cambia a '100%' para iniciar el zoom
      if (zoomScale === 'contain') zoomScale = '100%';

      if (event.deltaY < 0) {
        // Zoom in
        zoomScale = (parseFloat(zoomScale) + zoomStep) + '%';
      } else {
        // Zoom out, asegurando que no sea menor que 'contain'
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

    // Cleanup event listeners on component unmount
    return () => {
      imageZoom.removeEventListener('mousemove', handleMouseMove);
      imageZoom.removeEventListener('mouseout', handleMouseOut);
      imageZoom.removeEventListener('wheel', handleWheel);
    };
  }, [imageUrl]);

  return <div id="imageZoom"></div>;
};

export default Zoom;