import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getPlanes } from "../helpers/ServerPlans"; // Asegúrate de que la ruta sea correcta
import '../css/PlansSection.css';

const PlansSection = () => {
  const [planes, setPlanes] = useState([]);

  useEffect(() => {
    const fetchPlanes = async () => {
      try {
        const apiPlanes = await getPlanes();
        setPlanes(apiPlanes.planes); // Ajusta según cómo regresen los datos desde el servidor
      } catch (error) {
        console.error("Error al obtener los planes:", error);
      }
    };

    fetchPlanes();
  }, []);

  return (
    <section className="plans-section">
      <Container>
        <h2 className="text-center fw-bold">¡Dale el mejor cuidado a tus mascotas con nuestros servicios!</h2>
        <Row className="row-cols-sm-1 row-cols-lg-3 my-3 custom-row">
          {planes.map(plan => (
            <Link to={'/planes'} key={plan._id}>
              <Col className="h-100">
                <div className="plan-card text-center">
                  <h3>{plan.nombre}</h3>
                  <img src={plan.imagenUrl} alt={plan.nombre} />
                  <p>{plan.descripcion}</p>
                </div>
              </Col>
            </Link>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default PlansSection;