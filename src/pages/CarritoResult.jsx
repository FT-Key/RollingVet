import { useNavigate, useParams } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle, FaHourglassHalf } from 'react-icons/fa'; // Usaremos react-icons para los íconos
import '../css/CarritoResult.css';
import { useEffect } from 'react';
import { useAuth } from "../context/AuthContext"; // Importa el contexto
import { Helmet } from "react-helmet";

const CarritoResult = () => {
  const { result } = useParams(); // Obtiene el valor del parámetro 'result' de la URL
  const navigate = useNavigate();
  const { clearCart } = useAuth(); // Usa el carrito y la función para eliminar  

  const handleBackToHome = () => {
    navigate('/'); // Navega a la página de inicio
  };

  useEffect(() => {
    if (result == 'success') {
      clearCart();
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>Carrito</title>
      </Helmet>
      <div className="container-cart">
        {result === 'success' && (
          <>
            <FaCheckCircle className="checkIcon-cart success" />
            <h2>Tu pago se realizó con éxito.</h2>
          </>
        )}
        {result === 'failure' && (
          <>
            <FaTimesCircle className="checkIcon-cart failure" />
            <h2>Lo sentimos, la compra ha fallado. Inténtalo de nuevo.</h2>
          </>
        )}
        {result === 'pending' && (
          <>
            <FaHourglassHalf className="checkIcon-cart pending" />
            <h2>Tu compra está pendiente de confirmación.<br />Te notificaremos cuando se complete.</h2>
          </>
        )}
        <button className={`${result == 'success' ? 'button-cart' : ''}${result == 'failure' ? 'btn btn-danger' : ''}${result == 'pending' ? 'btn btn-secondary' : ''}`} onClick={handleBackToHome}>
          Volver a Inicio
        </button>
      </div>
    </>
  );
};

export default CarritoResult;