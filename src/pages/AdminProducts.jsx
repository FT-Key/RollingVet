import React, { useEffect, useMemo, useState } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import CustomButton from "../components/CustomButton";
import BasicModal from "../components/BasicModal"; // Verifica que la ruta sea correcta
import "../css/AdminProducts.css";
import { putServerData, deleteServerData } from "../helpers/ServerCalling";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { getProducts } from "../helpers/ServerProducts";
import PaginationComponent from "../components/PaginationComponent";
import { Helmet } from 'react-helmet-async';

const AdminProducts = () => {
  const [products, setProducts] = useState([]); // Productos obtenidos del servidor
  const [displayedProducts, setDisplayedProducts] = useState([]); // Productos a mostrar en la página actual
  const [updateMark, setUpdateMark] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // PAGINACION
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(5); // Límite de productos por página
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    let isMounted = true; // Variable para saber si el componente está montado

    const fetchProducts = async () => {
      while (true) {
        try {
          // Cambiar el límite a 50 para traer 50 productos en una sola solicitud
          const data = await getProducts(1, 50);
          if (isMounted) {
            setProducts(data.productos); // Guardar los 50 productos
            setTotalPages(Math.ceil(data.productos.length / limit)); // Calcular total de páginas
            setDisplayedProducts(data.productos.slice(0, limit)); // Mostrar primeros 5 productos
          }
          break; // Salir del bucle si la petición es exitosa
        } catch (error) {
          console.error("Error trayendo productos:", error);
          if (!isMounted) return; // Salir si el componente se desmontó
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Esperar 1 segundo antes de reintentar
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false; // Marcar como desmontado al limpiar el efecto
    };
  }, [updateMark]);

  // Actualiza los productos mostrados cada vez que cambia la página o el límite
  useEffect(() => {
    const startIndex = (currentPage - 1) * limit;
    const endIndex = startIndex + limit;
    setDisplayedProducts(products.slice(startIndex, endIndex));
  }, [currentPage, limit, products]);

  const BLOCKED_CONFIG = {
    true: { text: "Habilitar", color: "success" },
    false: { text: "Deshabilitar", color: "danger" },
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setModalShow(true);
  };

  const handleToggleLockClick = async (product) => {
    const apiUrl = import.meta.env.VITE_API_URL;

    try {
      const updatedProduct = { ...product, bloqueado: !product.bloqueado };
      await putServerData(apiUrl, `/productos/${product._id}`, updatedProduct);
      setUpdateMark((prevMark) => !prevMark);
    } catch (error) {
      console.error("Error actualizando estado bloqueado del producto:", error);
    }
  };

  const handleDeleteClick = (productId) => {
    confirmAlert({
      message: "¿Seguro desea eliminar el producto?",
      buttons: [
        {
          label: "Sí",
          onClick: async () => {
            const apiUrl = import.meta.env.VITE_API_URL;

            try {
              await deleteServerData(apiUrl, `/productos/${productId}`);
              setProducts(products.filter((product) => product.id !== productId));
            } catch (error) {
              console.error("Error eliminando producto:", error);
            }

            const alertContainer = document.querySelector(".react-confirm-alert");
            if (alertContainer) {
              alertContainer.remove();
            }
          },
        },
        {
          label: "No",
          onClick: () => {
            const alertContainer = document.querySelector(".react-confirm-alert");
            if (alertContainer) {
              alertContainer.remove();
            }
          },
        },
      ],
    });
  };

  const fillEmptySpaces = useMemo(() => {
    return Array(limit - displayedProducts.length).fill(null);
  }, [displayedProducts.length, limit]);

  return (
    <>
      <Helmet>
        <title>Admin Productos</title>
      </Helmet>
      <Container className="py-3 adminProducts">
        <Row className="text-center text-white header responsive">
          <Col>Productos</Col>
        </Row>

        <Row className="text-center header text-white normal">
          <Col xs={12} md={1}>ID</Col>
          <Col xs={12} md={2}>Image</Col>
          <Col xs={12} md={2}>Nombre</Col>
          <Col xs={12} md={2}>Categoría</Col>
          <Col xs={12} md={1}>Precio</Col>
          <Col xs={12} md={2}>Bloqueado</Col>
          <Col xs={12} md={1}>Editar</Col>
          <Col xs={12} md={1}>Eliminar</Col>
        </Row>

        {/* Renderizar los productos de la página actual */}
        {displayedProducts.map((product) => (
          <Row key={product.id} className="text-center" style={{ background: "white" }}>
            <Col xs={12} md={1}>{product.id}</Col>
            <Col xs={12} md={2}>
              <img src={product.imagenUrl} alt={product.nombre} style={{ width: "100px", height: "auto" }} />
            </Col>
            <Col xs={12} md={2}>{product.nombre}</Col>
            <Col xs={12} md={2}>{product.categoria}</Col>
            <Col xs={12} md={1}>${product.precio}</Col>
            <Col xs={12} md={2}>
              <CustomButton
                paddingB={false}
                className={"my-1"}
                variant={BLOCKED_CONFIG[product.bloqueado].color}
                buttonText={BLOCKED_CONFIG[product.bloqueado].text}
                onClick={() => handleToggleLockClick(product)}
              />
            </Col>
            <Col xs={12} md={1}>
              <CustomButton
                paddingB={false}
                className={"my-1"}
                variant={"warning"}
                buttonText={"Editar"}
                onClick={() => handleEditClick(product)}
              />
            </Col>
            <Col xs={12} md={1}>
              <CustomButton
                paddingB={false}
                className={"my-1"}
                btnClassName="btn-delete"
                variant={"danger"}
                buttonText={"X"}
                onClick={() => handleDeleteClick(product._id)}
              />
            </Col>
          </Row>
        ))}

        {/* Renderizar espacios vacíos para mantener la consistencia visual */}
        {fillEmptySpaces.map((_, index) => (
          <Row key={`empty-${index}`}>
            <Col xs={12} md={1}></Col>
            <Col xs={12} md={2}>
              <img className="void-image" src="/Espacio-transparente.png" alt="vacio" />
            </Col>
            <Col xs={12} md={2}></Col>
            <Col xs={12} md={2}></Col>
            <Col xs={12} md={1}></Col>
            <Col xs={12} md={2}></Col>
            <Col xs={12} md={1}></Col>
            <Col xs={12} md={1}></Col>
          </Row>
        ))}

        {selectedProduct && (
          <BasicModal
            type="adminProducts"
            show={modalShow}
            functionUpdateData={setUpdateMark}
            onHide={() => setModalShow(false)}
            productData={selectedProduct}
          />
        )}
      </Container>

      <PaginationComponent
        totalPages={totalPages}
        currentPage={currentPage}
        setPage={setCurrentPage}
      />
    </>
  );
};

export default AdminProducts;