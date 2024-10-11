import { useAuth } from "../context/AuthContext";
import { Col, Row, Button } from "react-bootstrap";
import BasicCard from "../components/BasicCard";
import { removeFromFavs } from "../helpers/ServerUsers";
import '../css/Favoritos.css';
import { Link } from "react-router-dom";
import { Helmet } from 'react-helmet-async';

const Favoritos = () => {
  const { favoritos, setUpdateMark, setBooleanUpdateMark } = useAuth();

  const handleRemoveFavorite = async (productId) => {
    const removeFromFavsFunction = async () => {
      await removeFromFavs(productId);
      setUpdateMark("fav");
      setBooleanUpdateMark((prevMark) => !prevMark);
    };
    removeFromFavsFunction();
  };

  return (
    <>
    <Helmet>
      <title>Favoritos</title>
    </Helmet>
      <h1 className="text-center pt-4">Favoritos</h1>
      {favoritos.length > 0 ? (
        <Row className="row-cols-sm-1 row-cols-md-2 row-cols-lg-3 my-3 custom-row g-3">
          {favoritos.map((prod) => (
            <Col className="p-0" key={prod._id}>
              <div className="position-relative">
                <Button
                  className="fav-remove-btn"
                  onClick={() => handleRemoveFavorite(prod._id)}
                >
                  X
                </Button>
                <BasicCard data={prod} type={"productCard"} />
              </div>
            </Col>
          ))}
        </Row>
      ) : (
        <div className="favorites-empty">
          <div className="empty-favorites text-center p-5">
            <img
              src="https://res.cloudinary.com/duic1bovf/image/upload/v1725038357/FavoritesEmpty_epadp9.png"
              alt="Favoritos vacíos"
              className="empty-favorites-img"
            />
            <h2 className="empty-favorites-message">Tus favoritos están vacíos</h2>
            <p className="empty-favorites-text">No tienes productos en tus favoritos. ¡Empieza a añadir productos que te gusten!</p>
            <Button variant="primary" as={Link} to={"/"}>Explorar</Button>
          </div>
        </div>
      )}
    </>
  );
};

export default Favoritos;