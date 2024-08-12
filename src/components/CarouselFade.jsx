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
        <Carousel fade data-bs-theme="light">
          {randomItems.map((prod, index) => (
            <Carousel.Item interval={2000} key={prod.id || index}>
              <Imagen
                url={prod.imageUrl}
                alt={prod.name}
                loading={index === 0}
              />
              <Carousel.Caption>
                <h3>{prod.name}</h3>
                <p>{prod.description}</p>
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