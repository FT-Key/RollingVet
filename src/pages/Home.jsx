import React, { useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import BasicCard from "../components/BasicCard";
import CarouselFade from "../components/CarouselFade";
import "../css/Home.css";
import { getProducts } from "../helpers/ServerProducts.js";
import PaginationComponent from "../components/PaginationComponent.jsx";
import PlansSection from "../components/PlansSection.jsx";
import { Helmet } from 'react-helmet-async';
import { getAnimals } from "../helpers/ServerAnimals.js";

const Home = () => {
  const [productos, setProductos] = useState([]);
  const [animalesAdopcion, setAnimalesAdopcion] = useState([]);
  const [productosCarrusel, setProductosCarrusel] = useState([]);

  // PAGINACION PRODUCTOS
  const [currentPageProd, setCurrentPageProd] = useState(1);
  const [limitProd, setLimitProd] = useState(3);
  const [totalPagesProd, setTotalPagesProd] = useState(1);

  // PAGINACION ANIMALES
  const [currentPageAnimal, setCurrentPageAnimal] = useState(1);
  const [limitAnimal, setLimitAnimal] = useState(3);
  const [totalPagesAnimal, setTotalPagesAnimal] = useState(1);

  useEffect(() => {
    let isMounted = true;

    const cargarDatos = async () => {
      try {
        // Llamada para obtener todos los productos y animales en una sola vez
        const dataProductos = await getProducts(); // Aquí podrías ajustar para obtener 30 productos
        const dataAdopcion = await getAnimals(1, 30, { estado: "En Adopción" }); // Aquí podrías ajustar para obtener 30 animales

        if (isMounted) {
          setProductos(dataProductos.productos);
          setAnimalesAdopcion(dataAdopcion.animales);

          // Calcular el total de páginas
          setTotalPagesProd(Math.ceil(dataProductos.productos.length / limitProd));
          setTotalPagesAnimal(Math.ceil(dataAdopcion.animales.length / limitAnimal));
        }

      } catch (error) {
        console.error("Error cargando datos:", error);
      }
    };

    cargarDatos();

    return () => {
      isMounted = false;
    };
  }, [limitProd, limitAnimal]);

  // Obtener los productos y animales a mostrar según la página actual
  const productosActuales = productos.slice((currentPageProd - 1) * limitProd, currentPageProd * limitProd);
  const animalesActuales = animalesAdopcion.slice((currentPageAnimal - 1) * limitAnimal, currentPageAnimal * limitAnimal);

  return (
    <>
      <Helmet>
        <title>RollingVet</title>
      </Helmet>
      {/* Sección de presentación */}
      <section className="home-hero">
        <div className="hero-content text-center">
          <h1>¡RollingVet!</h1>
          <h2>Seguridad y bienestar para tus mascotas.</h2>
          <p>
            Veterinaria especializada en caninos y felinos. Venta de productos
            para animales, comida, estética, salud, accesorios. Adopción de
            animales y planes de seguimiento de salud.
          </p>
        </div>
      </section>

      {/* Sección del carrusel de productos destacados */}
      <section className="carousel-section">
        <h2 className="text-center">Productos Destacados</h2>
        {productosCarrusel && <CarouselFade data={productosCarrusel} type={"productCarousel"} />}
      </section>

      {/* Sección de los 3 planes */}
      <PlansSection />

      {/* Sección de productos */}
      <section className="products-section">
        <Container>
          <h2 className="text-center">Nuestros Productos</h2>
          <Row className="row-cols-sm-1 row-cols-md-2 row-cols-lg-3 my-3 custom-row g-3">
            {productosActuales.map((prod) => (
              <Col className="p-0" key={prod.id}>
                <BasicCard data={prod} type={"productCard"} />
              </Col>
            ))}
          </Row>
          <PaginationComponent
            totalPages={totalPagesProd}
            currentPage={currentPageProd}
            setPage={setCurrentPageProd}
          />
        </Container>
      </section>

      {/* Sección de adopción */}
      <section className="adoption-section">
        <Container>
          <h2 className="text-center">Adopción de Animales</h2>
          <Row className="row-cols-sm-1 row-cols-md-2 row-cols-lg-3 my-3 custom-row g-3">
            {animalesActuales.map((animal) => (
              <Col className="p-0" key={animal._id}>
                <BasicCard data={animal} type={"animalCard"} />
              </Col>
            ))}
          </Row>
          <PaginationComponent
            totalPages={totalPagesAnimal}
            currentPage={currentPageAnimal}
            setPage={setCurrentPageAnimal}
          />
        </Container>
      </section>
    </>
  );
};

export default Home;