import React, { useState, useEffect } from "react";
import { Col, Row, Container, Button } from "react-bootstrap";
import BasicCard from "../components/BasicCard";
import CarouselFade from "../components/CarouselFade";
import { getProducts } from "../helpers/ServerProducts";
import '../css/ProductsComponent.css';
import { Helmet } from "react-helmet-async";

const ProductsComponent = () => {
  const [productos, setProductos] = useState([]);
  const [productosCarrusel, setProductosCarrusel] = useState([]);
  const [itemsToShow, setItemsToShow] = useState(6);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const data = await getProducts(page, 60);

        setProductos((prev) => {
          const nuevosProductos = data.productos.filter(
            (prod) => !prev.some((p) => p.id === prod.id)
          );
          return [...prev, ...nuevosProductos];
        });

        if (productosCarrusel.length === 0) {
          const productosDestacados = data.productos.slice(0, 5);
          setProductosCarrusel(productosDestacados);
        }
      } catch (error) {
        console.error("Error cargando productos:", error);
      }
    };

    cargarProductos();
  }, [page]);

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
    setItemsToShow((prev) => prev + 6);
  };

  return (
    <>
      <Helmet>
        <title>Productos</title>
      </Helmet>
      <section className="products-section">
        <Container fluid className="m-0 p-0">
          <h1 className="text-center fw-bold">Nuestros Productos</h1>

          <div className="carousel-section mb-4">
            <h2 className="text-center fw-bold">Productos Destacados</h2>
            {productosCarrusel.length > 0 && (
              <CarouselFade data={productosCarrusel} type={"productCarousel"} />
            )}
          </div>

          <Row className="row-cols-sm-1 row-cols-md-2 row-cols-lg-3 my-3 custom-row g-3">
            {productos.slice(0, itemsToShow).map((prod) => (
              <Col className="p-0" key={prod.id}>
                <BasicCard data={prod} type={"productCard"} />
              </Col>
            ))}
          </Row>

          {productos.length >= itemsToShow && (
            <div className="text-center mt-4">
              <Button className="btn-load" variant="secondary" onClick={handleLoadMore}>
                Cargar más
              </Button>
            </div>
          )}
        </Container>
      </section>
    </>
  );
};

export default ProductsComponent;