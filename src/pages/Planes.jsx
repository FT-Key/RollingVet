import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, Modal } from 'react-bootstrap';
import { useAuth } from "../context/AuthContext";
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { getPlanes, comprarPlan } from "../helpers/ServerPlans"; // Helper para obtener los planes y realizar la compra
import { getToken } from "../helpers/Token.helper"; // Para obtener el token del usuario
import { Helmet } from 'react-helmet-async';
import { getAnimals } from '../helpers/ServerAnimals';
import PaginationComponent from '../components/PaginationComponent';

const Planes = () => {
  const [planes, setPlanes] = useState([]); // Estado para los planes obtenidos del servidor
  const [mascotas, setMascotas] = useState([]); // Estado para controlar el modal
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedMascota, setSelectedMascota] = useState(null);
  const [idPreference, setIdPreference] = useState(null); // Estado para la preferencia de pago
  const [showModal, setShowModal] = useState(false); // Estado para controlar el modal
  const [page, setPage] = useState(1);
  const [limit] = useState(3);
  const [totalPages, setTotalPages] = useState(1);
  const { user } = useAuth();

  useEffect(() => {
    // Inicializar Mercado Pago
    initMercadoPago(import.meta.env.VITE_MP_PUBLIC_KEY); // Asegúrate de que la PUBLIC_KEY esté configurada en tus variables de entorno
    // Obtener los planes desde el servidor al cargar el componente
    const fetchPlanes = async () => {
      try {
        const apiPlanes = await getPlanes(); // Llama al helper que obtiene los planes
        setPlanes(apiPlanes.planes);
      } catch (error) {
        console.error("Error al obtener los planes:", error);
      }
    };
    const fetchMascotas = async () => {
      try {
        const misMascotas = await getAnimals(page, limit, { duenio: user._id, estado: "Mascota" }); // Llama al helper que obtiene los planes
        setMascotas(misMascotas.animales);
        if (misMascotas.pagination) {
          setTotalPages(
            Math.ceil(
              misMascotas.pagination.totalAnimales / (misMascotas.pagination.limit || misMascotas.pagination.totalAnimales)
            )
          );
        } else {
          setTotalPages(1);
        }
      } catch (error) {
        console.error("Error al obtener los planes:", error);
      }
    };

    fetchPlanes();
    fetchMascotas();
  }, [page, limit]);

  const contratarPlan = (plan) => {
    setSelectedPlan(plan._id === selectedPlan?._id ? null : plan);
  };

  const contratarMascota = (mascota) => {
    setSelectedMascota(mascota._id === selectedMascota?._id ? null : mascota);
  };

  const handlePaymentMethods = async () => {
    const token = getToken();

    if (selectedPlan && selectedMascota && token) {
      const planSeleccionado = { idPlan: selectedPlan._id, nombre: selectedPlan.nombre, precio: selectedPlan.precio };
      const mascotaSeleccionada = { idMascota: selectedMascota._id, nombre: selectedMascota.nombre };

      const returnUrl = `${window.location.origin}/pagos/result`;

      try {
        const response = await comprarPlan(planSeleccionado, mascotaSeleccionada, returnUrl);
        setIdPreference(response); // Setear la preferencia de MercadoPago
        setShowModal(true); // Muestra el modal
      } catch (error) {
        console.error("Error al procesar el pago:", error);
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Planes</title>
      </Helmet>
      <Container>
        <h1 className="text-center my-4">Selecciona un Plan</h1>
        <Row className="row-cols-1 row-cols-md-3 g-4">
          {planes.map((plan) => (
            <Col key={plan._id}>
              <Card className="h-100">
                <Card.Img variant="top" src={plan.imagenUrl} alt={plan.nombre} />
                <Card.Body>
                  <Card.Title>{plan.nombre}</Card.Title>
                  <Card.Text>{plan.descripcion}</Card.Text>
                  <Card.Text className="fw-bold text-success">${plan.precio}</Card.Text>
                </Card.Body>
                <Card.Footer className='text-center'>
                  <input
                    type="radio"
                    name="plan"
                    id={`plan-${plan._id}`}
                    checked={selectedPlan?._id === plan._id}
                    onChange={() => contratarPlan(plan)}
                  />
                  <label htmlFor={`plan-${plan._id}`}>{` Seleccionar ${plan.nombre}`}</label>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      <Container className='my-4'>
        <h1 className="text-center my-4">Selecciona una Mascota</h1>
        {mascotas?.length > 0 ? (
          <>
            <Row className="row-cols-1 row-cols-md-3 g-4">
              {mascotas.map((mascota) => (
                <Col key={mascota._id}>
                  <Card className="h-100">
                    <Card.Img variant="top" src={mascota.fotoUrl} alt={mascota.nombre} />
                    <Card.Body>
                      <Card.Title>{mascota.nombre}</Card.Title>
                      <Card.Text>{mascota.tipo}</Card.Text>
                      <Card.Text className="fw-bold text-success">{mascota.edad} años</Card.Text>
                    </Card.Body>
                    <Card.Footer className='text-center'>
                      <input
                        type="radio"
                        name="mascota"
                        id={`mascota-${mascota._id}`}
                        checked={selectedMascota?._id === mascota._id}
                        onChange={() => contratarMascota(mascota)}
                      />
                      <label htmlFor={`mascota-${mascota._id}`}>{` Seleccionar ${mascota.nombre}`}</label>
                    </Card.Footer>
                  </Card>
                </Col>
              ))}
            </Row>
            <PaginationComponent totalPages={totalPages} currentPage={page} setPage={setPage} />
          </>
        ) : (
          <h2 className='text-center'>No se registró ninguna mascota</h2>
        )}
      </Container>

      <div className='text-center'>
        <Button variant='success' onClick={handlePaymentMethods} className='my-4' disabled={!selectedPlan || !selectedMascota}>
          Confirmar Selección y Pagar
        </Button>
      </div>

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

export default Planes;