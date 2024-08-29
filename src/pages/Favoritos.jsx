import { useAuth } from "../context/AuthContext";
import { Col, Row, Button } from "react-bootstrap";
import BasicCard from "../components/BasicCard";
import { removeFromFavs } from "../helpers/ServerUsers";
import '../css/Favoritos.css';

const Favoritos = () => {
  const { favoritos, setUpdateMark, setBooleanUpdateMark } = useAuth();

  // Función para manejar la eliminación de un favorito
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
      <h2 className="text-center pt-4">Favoritos</h2>
      <Row className="row-cols-sm-1 row-cols-md-2 row-cols-lg-3 my-3 custom-row g-3">
        {favoritos.map((prod) => (
          <Col className="p-0" key={prod._id}>
            {/* Contenedor para posicionar el botón relativo a la tarjeta */}
            <div className="position-relative">
              {/* Botón X para eliminar */}
              <Button
                className="fav-remove-btn"
                onClick={() => handleRemoveFavorite(prod._id)}
              >
                X
              </Button>
              {/* Card */}
              <BasicCard data={prod} type={"productCard"} />
            </div>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default Favoritos;