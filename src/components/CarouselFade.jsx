import Carousel from 'react-bootstrap/Carousel';
import Imagen from './Imagen';
import { useMemo } from 'react';
import '../css/CarouselFade.css'

function CarouselFade({ data, type }) {
  // Use useMemo para evitar recalcuar en cada render
  const randomItems = useMemo(() => getRandomItems(data, 3), [data]);

  return (
    <>
      {type === 'productCarousel' &&
        <Carousel fade data-bs-theme="light" className="custom-carousel">
          {randomItems.map((prod, index) => (
            <Carousel.Item interval={2000} key={prod.id || index}>
              <Imagen
                url={prod.imagenUrl}
                alt={prod.nombre}
                loading={index === 0}
              />
              <Carousel.Caption>
                <h3>{prod.nombre}</h3>
                <p>{prod.descripcion}</p>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
      }

      {type === 'profesionales' &&
        <Carousel fade data-bs-theme="dark" className="custom-carousel profesional">
          {randomItems.map((prof, index) => (
            <Carousel.Item interval={2000} key={`profesional-${index}`}>
              <Imagen
                url={prof.imagenUrl}
                alt={prof.nombre}
                loading={index === 0}
              />
              <Carousel.Caption>
                <h3>{prof.nombre}</h3>
                <p>{prof.descripcion}</p>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
      }
    </>
  );
}

const getRandomItems = (array, numItems) => {
  // Shuffle array and get the first `numItems` items
  const shuffled = array.slice().sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numItems);
};

export default CarouselFade;