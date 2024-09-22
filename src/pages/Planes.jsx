import { useState } from 'react';
import { Container, Row, Col, Button, Card, Modal } from 'react-bootstrap';
import { useAuth } from "../context/AuthContext";
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { postServerData } from "../helpers/ServerCalling"; // Reutiliza el helper para llamadas al servidor
import { getToken } from "../helpers/Token.helper"; // Para obtener el token del usuario

const Planes = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedMascota, setSelectedMascota] = useState(null);
  const [idPreference, setIdPreference] = useState(null); // Estado para la preferencia de pago
  const [showModal, setShowModal] = useState(false); // Estado para controlar el modal
  const { user } = useAuth();

  const planes = [
    { id: 1, nombre: "Plan Básico", descripcion: "Incluye vacunación y revisión anual.", precio: 100, imagen: "/Plan-1-02.png" },
    { id: 2, nombre: "Plan Completo", descripcion: "Vacunación, desparasitación y revisión semestral.", precio: 200, imagen: "/Plan-2-02.png" },
    { id: 3, nombre: "Plan Premium", descripcion: "Todos los servicios de salud y seguimiento personalizado.", precio: 300, imagen: "/Plan-3-02.png" },
  ];

  const contratarPlan = (plan) => {
    setSelectedPlan(plan.id === selectedPlan?.id ? null : plan);
  };

  const contratarMascota = (mascota) => {
    setSelectedMascota(mascota._id === selectedMascota?._id ? null : mascota);
  };

  const handlePaymentMethods = async () => {
    const token = getToken();

    if (selectedPlan && selectedMascota && token) {
      const planSeleccionado = { idPlan: selectedPlan.id, nombre: selectedPlan.nombre, precio: selectedPlan.precio };
      const mascotaSeleccionada = { idMascota: selectedMascota._id, nombre: selectedMascota.nombre };

      const returnUrl = `${window.location.origin}/planes/result`;

      await methodMercadoPago({ planSeleccionado, mascotaSeleccionada, returnUrl }, token);
      setShowModal(true); // Muestra el modal
    }
  };

  const methodMercadoPago = async (data, token) => {
    initMercadoPago(import.meta.env.VITE_MP_PUBLIC_KEY);
    const apiUrl = import.meta.env.VITE_API_URL;

    const response = await postServerData(apiUrl, "/planes/comprarPlan", data, token);

    if (response && typeof response === 'string') {
      setIdPreference(response);
    } else {
      console.log("Error: la respuesta del servidor no es válida", response);
    }
  };

  return (
    <>
      <Container>
        <h1 className="text-center my-4">Elige un Plan</h1>
        <Row className="row-cols-1 row-cols-md-3 g-4">
          {planes.map((plan) => (
            <Col key={plan.id}>
              <Card className="h-100">
                <Card.Img variant="top" src={plan.imagen} alt={plan.nombre} />
                <Card.Body>
                  <Card.Title>{plan.nombre}</Card.Title>
                  <Card.Text>{plan.descripcion}</Card.Text>
                  <Card.Text className="fw-bold text-success">${plan.precio}</Card.Text>
                </Card.Body>
                <Card.Footer className='text-center'>
                  <input
                    type="radio"
                    name="plan"
                    id={`plan-${plan.id}`}
                    checked={selectedPlan?.id === plan.id}
                    onChange={() => contratarPlan(plan)}
                  />
                  <label htmlFor={`plan-${plan.id}`}>{` Seleccionar ${plan.nombre}`}</label>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      <Container className='my-4'>
        <h1 className="text-center my-4">Elige una Mascota</h1>
        {user.mascotas?.length > 0 ? (
          <Row className="row-cols-1 row-cols-md-3 g-4">
            {user.mascotas.map((mascota) => (
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