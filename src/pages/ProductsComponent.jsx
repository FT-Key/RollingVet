import React, { useState, useEffect } from "react";
import { Col, Row, Container, Button } from "react-bootstrap"; // Asegúrate de importar Button
import BasicCard from "../components/BasicCard";
import CarouselFade from "../components/CarouselFade";
import { getProducts } from "../helpers/ServerProducts"; // Asegúrate de que la ruta sea correcta
import '../css/ProductsComponent.css';
import { Helmet } from "react-helmet-async";

const ProductsComponent = () => {
  const [productos, setProductos] = useState([]);
  const [productosCarrusel, setProductosCarrusel] = useState([]);
  const [itemsToShow, setItemsToShow] = useState(6); // Mostrar inicialmente 6 productos
  const [page, setPage] = useState(1); // Estado para controlar la página

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const data = await getProducts(page, 60); // Traer 6 productos por solicitud

        // Agregar los nuevos productos a los existentes solo si no están duplicados
        setProductos((prev) => {
          const nuevosProductos = data.productos.filter(
            (prod) => !prev.some((p) => p.id === prod.id)
          );
          return [...prev, ...nuevosProductos]; // Concatenar los productos nuevos
        });

        // Configura los productos para el carrusel solo una vez
        if (productosCarrusel.length === 0) {
          const productosDestacados = data.productos.slice(0, 5); // Por ejemplo, los primeros 5 productos
          setProductosCarrusel(productosDestacados);
        }
      } catch (error) {
        console.error("Error cargando productos:", error);
      }
    };

    cargarProductos();
  }, [page]); // Se ejecuta cuando cambia la página

  // Maneja la lógica de "Cargar más"
  const handleLoadMore = () => {
    setPage((prev) => prev + 1); // Incrementa la página
    setItemsToShow((prev) => prev + 6); // Incrementa la cantidad de productos a mostrar
  };

  return (
    <>
      <Helmet>
        <title>Productos</title>
      </Helmet>
      <section className="products-section">
        <Container fluid className="m-0 p-0">
          <h1 className="text-center fw-bold">Nuestros Productos</h1>

          {/* Carrusel de productos destacados */}
          <div className="carousel-section mb-4">
            <h2 className="text-center fw-bold">Productos Destacados</h2>
            {productosCarrusel.length > 0 && (
              <CarouselFade data={productosCarrusel} type={"productCarousel"} />
            )}
          </div>

          {/* Lista de productos */}
          <Row className="row-cols-sm-1 row-cols-md-2 row-cols-lg-3 my-3 custom-row g-3">
            {productos.slice(0, itemsToShow).map((prod) => ( // Mostrar productos hasta itemsToShow
              <Col className="p-0" key={prod.id}>
                <BasicCard data={prod} type={"productCard"} />
              </Col>
            ))}
          </Row>

          {/* Botón de "Cargar más" */}
          {productos.length >= itemsToShow && ( // Mostrar botón si hay más productos que los mostrados
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