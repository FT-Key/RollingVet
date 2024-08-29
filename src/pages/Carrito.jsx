import { useAuth } from "../context/AuthContext"; // Importa el contexto
import { Col, Row, Button, Form } from "react-bootstrap"; // Agrega Button y Form
import { useEffect, useState } from "react";
import '../css/Carrito.css';
import { postServerData } from "../helpers/ServerCalling";
import { getToken } from "../helpers/Token.helper";
import { removeFromCart } from "../helpers/ServerUsers";

const Carrito = () => {
  const { carrito, setUpdateMark, setBooleanUpdateMark } = useAuth(); // Usa el carrito y la función para eliminar
  const [cantidades, setCantidades] = useState(
    carrito.reduce((acc, prod) => ({ ...acc, [prod._id]: 1 }), {})
  );

  useEffect(() => {
    // Escucha los cambios en el carrito
    setCantidades(carrito.reduce((acc, prod) => ({ ...acc, [prod._id]: 1 }), {}));
  }, [carrito]); // Se actualiza cada vez que 'carrito' cambia

  const handleCantidadChange = (id, nuevaCantidad) => {
    setCantidades({ ...cantidades, [id]: parseInt(nuevaCantidad) });
    // Aquí puedes añadir lógica para enviar la cantidad actualizada al backend si es necesario
  };

  const handleBuyProducts = async () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const token = getToken();
  
    if (token) {
      const bodyProductos = Object.entries(cantidades).map(([idProducto, cantidad]) => ({ idProducto, cantidad }));
      const response = await postServerData(apiUrl, "/favncart/carrito/comprarProductos", bodyProductos, token);
  
      if (response && typeof response === 'string') {
        // Abre el enlace en una nueva pestaña
        window.open(response, '_blank');
      } else {
        console.log("Error: la respuesta del servidor no es un enlace válido", response);
      }
    }
  };  

  const handleRemoveProduct = async (idProducto) => {
    try {
      // Espera a que se elimine el producto del servidor
      await removeFromCart(idProducto);

      // Marca el carrito como actualizado
      setUpdateMark("cart");
      setBooleanUpdateMark((prevMark) => !prevMark);
    } catch (error) {
      console.error("Error al eliminar el producto del carrito:", error);
    }
  };

  return (
    <>
      <h2 className="text-center pt-4">Carrito</h2>
      <Row className="carrito-row g-3 p-5 mx-2">
        {/* Encabezados */}
        <Row className="border rounded p-3 bg-success text-white d-none d-md-flex">
          <Col xs={12} md={2}>
            <strong>Imagen del producto</strong>
          </Col>

          <Col xs={12} md={2}>
            <strong>Nombre</strong>
          </Col>

          <Col xs={12} md={2}>
            <strong>Marca</strong>
          </Col>

          <Col xs={12} md={2}>
            <strong>Modelo</strong>
          </Col>

          <Col xs={12} md={2}>
            <strong>Cantidad</strong>
          </Col>

          <Col xs={12} md={2}>
            <strong>Eliminar</strong>
          </Col>
        </Row>

        {/* Productos */}
        {carrito.map((prod) => (
          <Row key={prod._id} className="align-items-center border rounded p-3">
            <Col xs={12} md={2}>
              <img src={prod.imageUrl} alt={prod.name} />
            </Col>

            <Col xs={12} md={2}>
              <h5>{prod.name}</h5>
            </Col>

            <Col xs={12} md={2}>
              <p>Marca: {prod.brand}</p>
            </Col>

            <Col xs={12} md={2}>
              <p>Modelo: {prod.model}</p>
            </Col>

            <Col xs={12} md={2}>
              <Form.Control
                type="number"
                min="1"
                value={cantidades[prod._id]}
                onChange={(e) => handleCantidadChange(prod._id, e.target.value)}
                style={{ width: "80px" }}
              />
            </Col>

            <Col xs={12} md={2}>
              <Button className="cart-remove-btn" onClick={() => handleRemoveProduct(prod._id)}>
                X
              </Button>
            </Col>
          </Row>
        ))}
        <Row className="pt-3">
          <Col xs={0} md={9}></Col>
          <Col xs={12} md={3}>
            <Button variant="success" onClick={() => handleBuyProducts()}>
              Pagar
            </Button>
          </Col>
        </Row>
      </Row>

    </>
  );
};

export default Carrito;