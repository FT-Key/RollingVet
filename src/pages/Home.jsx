import React, { useState, useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import BasicCard from '../components/BasicCard';
import CarouselFade from '../components/CarouselFade';
import '../css/Home.css';
import CustomButton from '../components/CustomButton';
import BasicModal from '../components/BasicModal';
import { fetchServerData } from "../helpers/ServerCalling.js";

const Home = () => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    let isMounted = true; // Variable para saber si el componente está montado

    const cargarProductos = async () => {
      while (true) {
        try {
          const data = await fetchServerData('http://localhost:3001', '/productos');
          if (isMounted) {
            setProductos(data);
          }
          break; // Salir del bucle si la petición es exitosa
        } catch (error) {
          console.error('Error cargando productos:', error);
          if (!isMounted) return; // Salir si el componente se desmontó
          await new Promise(resolve => setTimeout(resolve, 1000)); // Esperar 1 segundo antes de reintentar
        }
      }
    };

    cargarProductos();

    return () => {
      isMounted = false; // Marcar como desmontado al limpiar el efecto
    };
  }, []);

  return (
    <>
      <h2 className='my-5 text-center'>Bienvenido a la Página Principal</h2>

      <CarouselFade data={productos} type={'productCarousel'} />

      <Row className='row-cols-sm-1 row-cols-md-2 row-cols-lg-3 my-3 custom-row g-3'>
        {productos.map((prod) => (
          <Col className='p-0' key={prod.id}>
            <BasicCard data={prod} type={'productCard'} />
          </Col>
        ))}
      </Row>
    </>
  );
};

export default Home;