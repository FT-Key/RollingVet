import { useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa'; // Usaremos react-icons para el ícono del check
import '../css/CarritoSuccess.css';

const CarritoSuccess = () => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/'); // Navega a la página de inicio
  };

  return (
    <div className={'container-cart'}>
      <FaCheckCircle className={'checkIcon-cart'} />
      <h2>Tu pago se realizó con éxito</h2>
      <button className={'button-cart'} onClick={handleBackToHome}>
        Volver a Inicio
      </button>
    </div>
  );
};

export default CarritoSuccess;