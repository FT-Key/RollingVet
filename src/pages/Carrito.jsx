import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import BasicCard from "../components/BasicCard";
import { getCart } from "../helpers/ServerUsers";
import { isTokenValid } from "../helpers/Token.helper";

const Carrito = () => {
  const navigate = useNavigate();
  const [carrito, setCarrito] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('authToken');

    if (token && isTokenValid(token)) {
      (async () => {
        const cart = await getCart();
        setCarrito(cart.productos);
      })();
    } else {
      navigate('/inicioSesion');
    }

  }, []);
  return (
    <>
      <h2 className="text-center pt-4">Carrito</h2>
      <Row className="row-cols-sm-1 row-cols-md-2 row-cols-lg-3 my-3 custom-row g-3">
        {carrito.map((prod) => (
          <Col className="p-0" key={prod.id}>
            <BasicCard data={prod} type={"productCard"} />
          </Col>
        ))}
      </Row>
    </>
  )
}

export default Carrito