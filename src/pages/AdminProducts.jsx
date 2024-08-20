import React, { useEffect, useState } from "react";
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

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [updateMark, setUpdateMark] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    let isMounted = true; // Variable para saber si el componente está montado

    const fetchProducts = async () => {
      while (true) {
        try {
          const data = await getProducts();
          if (isMounted) {
            setProducts(data);
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
      const updatedProduct = { ...product, blocked: !product.blocked };
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
              setProducts(
                products.filter((product) => product.id !== productId)
              );
            } catch (error) {
              console.error("Error eliminando producto:", error);
            }

            // Elimina el contenedor del alert del DOM después de cerrar el alert
            const alertContainer = document.querySelector(
              ".react-confirm-alert"
            );
            if (alertContainer) {
              alertContainer.remove();
            }
          },
        },
        {
          label: "No",
          onClick: () => {
            // Elimina el contenedor del alert del DOM después de cerrar el alert
            const alertContainer = document.querySelector(
              ".react-confirm-alert"
            );
            if (alertContainer) {
              alertContainer.remove();
            }
          },
        },
      ],
    });
  };

  return (
    <>
      <Container className="py-3">
        <Row className="text-center text-white header responsive">
          <Col>Productos</Col>
        </Row>

        <Row className="text-center header text-white normal">
          <Col xs={12} md={1}>
            ID
          </Col>
          <Col xs={12} md={2}>
            Image
          </Col>
          <Col xs={12} md={2}>
            Nombre
          </Col>
          <Col xs={12} md={2}>
            Categoría
          </Col>
          <Col xs={12} md={1}>
            Precio
          </Col>
          <Col xs={12} md={2}>
            Bloqueado
          </Col>
          <Col xs={12} md={1}>
            Editar
          </Col>
          <Col xs={12} md={1}>
            Eliminar
          </Col>
        </Row>

        {products.map((product) => (
          <Row
            key={product.id}
            className="text-center"
            style={{ background: "white" }}
          >
            <Col xs={12} md={1}>
              {product.id}
            </Col>
            <Col xs={12} md={2}>
              <img
                src={product.imageUrl}
                alt={product.name}
                style={{ width: "100px", height: "auto" }}
              />
            </Col>
            <Col xs={12} md={2}>
              {product.name}
            </Col>
            <Col xs={12} md={2}>
              {product.category}
            </Col>
            <Col xs={12} md={1}>
              ${product.price}
            </Col>
            <Col xs={12} md={2}>
              <CustomButton
                paddingB={false}
                className={"my-1"}
                variant={BLOCKED_CONFIG[product.blocked].color}
                buttonText={BLOCKED_CONFIG[product.blocked].text}
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
    </>
  );
};

export default AdminProducts;
