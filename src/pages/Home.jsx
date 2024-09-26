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
  const [animalesAdopcion, setAnimalesAdopcion] = useState(false);
  const [productosCarrusel, setProductosCarrusel] = useState(false);
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

    const cargarProductos = async () => {
      while (true) {
        try {
          const data = await getProducts(currentPageProd, limitProd);
          const dataAdopcion = await getAnimals(currentPageAnimal, limitAnimal, { estado: "En Adopción" }); // Aquí deberías obtener productos relacionados con adopción

          if (isMounted) {
            setProductos(data.productos);
            setTotalPagesProd(
              Math.ceil(data.pagination.totalProductos / data.pagination.limit)
            );

            setAnimalesAdopcion(dataAdopcion.animales);
            setTotalPagesAnimal(
              Math.ceil(dataAdopcion.pagination.totalAnimales / data.pagination.limit)
            );
          }

          if (!productosCarrusel) {
            const dataCarrusel = await getProducts();
            if (isMounted) {
              setProductosCarrusel(dataCarrusel.productos);
            }
          }

          break;
        } catch (error) {
          console.error("Error cargando productos:", error);
          if (!isMounted) return;
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    };

    cargarProductos();

    return () => {
      isMounted = false;
    };
  }, [currentPageProd, limitProd, currentPageAnimal, limitAnimal]);

  return (
    <>
      <Helmet>
        <title>RollingVet</title>
      </Helmet>
      {/* Sección de presentación */}
      <section className="home-hero">
        <div className="hero-content text-center">
          <h1>RollingVet</h1>
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
            {productos.map((prod) => (
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
            {animalesAdopcion && animalesAdopcion.map((animal) => (
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