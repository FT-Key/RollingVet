import { useAuth } from "../context/AuthContext"; // Importa el contexto
import { Col, Row, Button, Form, Modal } from "react-bootstrap"; // Agrega Modal
import { useEffect, useMemo, useState } from "react";
import '../css/Carrito.css';
import { postServerData } from "../helpers/ServerCalling";
import { getToken } from "../helpers/Token.helper";
import { removeFromCart } from "../helpers/ServerUsers";
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react'
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from 'react-helmet-async';

const Carrito = () => {
  const { carrito, setUpdateMark, setBooleanUpdateMark, cantidades, handleCantidadChange } = useAuth(); // Usa el carrito y la función para eliminar
  const [idPreference, setIdPreference] = useState(null);
  const [showModal, setShowModal] = useState(false); // Estado para controlar el modal
  const navigate = useNavigate();

  useEffect(() => {
    setUpdateMark('cart'); // Se hace un setUpdateMark con 'cart' al iniciar el componente para que el contexto actualice el carrito y se seteen las cantidades iniciales si aún no hay cantidades previas
  });

  const handleCantidadChangeLocal = (id, nuevaCantidad) => {
    handleCantidadChange(id, nuevaCantidad);
  };

  const handlePaymentMethods = async () => {
    const token = getToken();

    if (token) {
      const bodyProductos = Object.entries(cantidades).map(([idProducto, cantidad]) => ({ idProducto, cantidad }));
      const returnUrl = `${window.location.origin}/pagos/result`;

      console.log("BODYPRODUCTOS: ", bodyProductos)
      await methodMercadoPago(bodyProductos, returnUrl, token);
      setShowModal(true); // Abre el modal cuando se obtiene el ID de preferencia
    }
  };

  const methodMercadoPago = async (productos, returnUrl, token) => {
    initMercadoPago(import.meta.env.VITE_MP_PUBLIC_KEY);
    const apiUrl = import.meta.env.VITE_API_URL;

    console.log("Se envia: ", productos)
    const response = await postServerData(apiUrl, "/favncart/carrito/comprarProductosMercadoPago", { productos, returnUrl }, token);

    if (response && typeof response === 'string') {
      setIdPreference(response);
    } else {
      console.log("Error: la respuesta del servidor no es un enlace válido", response);
    }
  };

  const handleRemoveProduct = async (idProducto) => {
    try {
      await removeFromCart(idProducto);
      setUpdateMark("cart");
      setBooleanUpdateMark((prevMark) => !prevMark);
    } catch (error) {
      console.error("Error al eliminar el producto del carrito:", error);
    }
  };

  // Cálculo del precio total con useMemo
  const totalPrice = useMemo(() => {
    if (carrito.length > 0 && cantidades) {
      return carrito.reduce((total, prod) => {
        const cantidad = cantidades[prod._id] || 1;
        return total + prod.precio * cantidad;
      }, 0);
    }
  }, [carrito, cantidades]);

  return (
    <>
    <Helmet>
      <title>Carrito</title>
    </Helmet>
      <h1 className="text-center pt-4">Carrito</h1>
      {carrito.length > 0 ? (
        <Row className="carrito-row g-3 p-5 mx-2">
          <Row className="border p-3 bg-success text-white d-none d-md-flex cart-header">
            <Col xs={12} md={2}><strong>Imagen del producto</strong></Col>
            <Col xs={12} md={2}><strong>Nombre</strong></Col>
            <Col xs={12} md={2}><strong>Marca</strong></Col>
            <Col xs={12} md={2}><strong>Modelo</strong></Col>
            <Col xs={12} md={1}><strong>Cantidad</strong></Col>
            <Col xs={12} md={2}><strong>Precio</strong></Col>
            <Col xs={12} md={1}><strong>Eliminar</strong></Col>
          </Row>

          {carrito.map((prod) => (
            <Row key={prod._id} className="align-items-center border p-3">
              <Col xs={12} md={2} className="cart-img">
                <img src={prod.imagenUrl} alt={prod.nombre} onClick={() => navigate(`/productDetail/${prod._id}`)} />
              </Col>
              <Col xs={12} md={2}><h5>{prod.nombre}</h5></Col>
              <Col xs={12} md={2}><p>Proveedor: {prod.proveedor}</p></Col>
              <Col xs={12} md={2}><p>Garantía: {prod.garantia}</p></Col>
              <Col xs={12} md={1}>
                <Form.Control
                  className={'text-center'}
                  type="number"
                  min="1"
                  value={cantidades[prod._id] || 1}
                  onChange={(e) => handleCantidadChangeLocal(prod._id, e.target.value)}
                  style={{ width: "80px" }}
                />
              </Col>
              <Col xs={12} md={2}><p>Precio: ${prod.precio}</p></Col>
              <Col xs={12} md={1}>
                <Button className="cart-remove-btn" onClick={() => handleRemoveProduct(prod._id)}>
                  X
                </Button>
              </Col>
            </Row>
          ))}

          <Row className="border p-3 bg-success text-white cart-footer">
            <Col xs={12} md={9}></Col>
            <Col xs={12} md={2}><strong>Total: ${totalPrice.toFixed(2)}</strong></Col>
            <Col xs={12} md={1}></Col>
          </Row>

          <Row className="pt-3">
            <Col xs={0} md={9}></Col>
            <Col xs={12} md={3} className="d-flex flex-column">
              <Button variant="success" onClick={() => handlePaymentMethods()}>
                Métodos de pago
              </Button>
            </Col>
          </Row>
        </Row>
      ) : (

        <div className="cart-empty">
          <div className="empty-cart text-center p-5">
            <img src="https://res.cloudinary.com/duic1bovf/image/upload/v1724994639/carritoVacio_o0ldyf.png" alt="Carrito vacío" className="empty-cart-img" />
            <h2 className="empty-cart-message">Tu carrito está vacío</h2>
            <p className="empty-cart-text">No tienes productos en tu carrito. ¡Empieza a comprar ahora!</p>
            <Button variant="success" as={Link} to={"/"}>Ir a la tienda</Button>
          </div>
        </div>
      )}

      {/* Modal para MercadoPago Wallet */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Completar Pago</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {idPreference && (
            <Wallet initialization={{ preferenceId: idPreference, redirectMode: 'self' }} customization={{ texts: { valueProp: 'smart_option' } }} />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Carrito;