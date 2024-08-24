import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { getFavs } from "../helpers/ServerUsers";
import { Col, Row } from "react-bootstrap";
import BasicCard from "../components/BasicCard";
import { isTokenValid } from "../helpers/Token.helper";

const Favoritos = () => {
  const navigate = useNavigate();
  const [favoritos, setFavoritos] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('authToken');

    if (token && isTokenValid(token)) {
      (async () => {
        const favs = await getFavs();
        setFavoritos(favs.productos);
      })();
    } else {
      navigate('/inicioSesion');
    }

  }, []);
  return (
    <>
      <h2 className="text-center pt-4">Favoritos</h2>
      <Row className="row-cols-sm-1 row-cols-md-2 row-cols-lg-3 my-3 custom-row g-3">
        {favoritos.map((prod) => (
          <Col className="p-0" key={prod.id}>
            <BasicCard data={prod} type={"productCard"} />
          </Col>
        ))}
      </Row>
    </>
  )
}

export default Favoritos