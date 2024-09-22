import { Col, Container, Row } from "react-bootstrap"
import { Link } from "react-router-dom"

const PlansSection = () => {
  return (
    <>
      {/* Sección de los 3 planes */}
      <section className="plans-section">
        <Container>
          <h2 className="text-center">Nuestros Planes</h2>
          <Row className="row-cols-sm-1 row-cols-lg-3 my-3 custom-row">

            <Link to={'/planes'}>
              <Col>
                <div className="plan-card text-center">
                  <h3>Plan Básico</h3>
                  <img src="/Plan-1-01.png" alt="plan básico" />
                  <p>Incluye vacunación y revisión anual.</p>
                </div>
              </Col>
            </Link>

            <Link to={'/planes'}>
              <Col>
                <div className="plan-card text-center">
                  <h3>Plan Completo</h3>
                  <img src="/Plan-2-01.png" alt="plan completo" />
                  <p>Vacunación, desparasitación y revisión semestral.</p>
                </div>
              </Col>
            </Link>

            <Link to={'/planes'}>
              <Col>
                <div className="plan-card text-center">
                  <h3>Plan Premium</h3>
                  <img src="/Plan-3-01.png" alt="plan premium" />
                  <p>Todos los servicios de salud y seguimiento personalizado.</p>
                </div>
              </Col>
            </Link>

          </Row>
        </Container>
      </section>
    </>
  )
}

export default PlansSection