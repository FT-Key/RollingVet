import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import BasicCard from "../components/BasicCard";
import { getCart } from "../helpers/ServerUsers";

const Carrito = () => {
  const [carrito, setCarrito] = useState([]);

  useEffect(() => {

    (async () => {
      const cart = await getCart();
      setCarrito(cart.productos);
    })();

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