import { useNavigate, useParams } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle, FaHourglassHalf } from 'react-icons/fa';
import '../css/PagosResult.css';
import { useEffect } from 'react';
import { useAuth } from "../context/AuthContext";
import { Helmet } from 'react-helmet-async';

const PagosResult = () => {
  const { result } = useParams();
  const navigate = useNavigate();
  const { clearCart } = useAuth();

  const handleBackToHome = () => {
    navigate('/');
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
            <h2>Lo sentimos, el pago ha fallado. Inténtalo de nuevo.</h2>
          </>
        )}
        {result === 'pending' && (
          <>
            <FaHourglassHalf className="checkIcon-cart pending" />
            <h2>Tu paho está pendiente de confirmación.<br />Te notificaremos cuando se complete.</h2>
          </>
        )}
        <button className={`${result == 'success' ? 'button-cart' : ''}${result == 'failure' ? 'btn btn-danger' : ''}${result == 'pending' ? 'btn btn-secondary' : ''}`} onClick={handleBackToHome}>
          Volver a Inicio
        </button>
      </div>
    </>
  );
};

export default PagosResult;