import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getOneAnimal } from "../helpers/ServerAnimals"; // Helper para obtener un animal
import "../css/AnimalDetail.css";
import Loading from "../components/Loading";
import { Col, Container, Row, Button } from "react-bootstrap";
import Zoom from '../components/Zoom'; // Componente Zoom para las imágenes
import { Helmet } from 'react-helmet-async';
import { useAuth } from "../context/AuthContext";

const AnimalDetail = () => {
  const { user } = useAuth();
  const { animalId } = useParams(); // Usamos animalId en lugar de productId
  const [animal, setAnimal] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnimal = async () => {
      const data = await getOneAnimal(animalId); // Helper para obtener un animal
      setAnimal(data);
    };
    fetchAnimal();
  }, [animalId]);

  const handleBack = () => {
    navigate(-1); // Regresa a la página anterior
  };

  if (!animal) {
    return <Loading />;
  }

  return (
    <>
      <Helmet>
        <title>Detalle del animal</title>
      </Helmet>
      <div className="animal-detail">
        <Container fluid>
          <Row>

            <Col xs={12}>
              <h1>{animal.nombre}</h1>
            </Col>

            <Col xs={12} md={6}>
              {/* Componente Zoom para la imagen del animal */}
              <Zoom imageUrl={animal.fotoUrl}>
              </Zoom>
            </Col>

            <Col xs={12} md={6}>
              <p>
                <strong>Especie:</strong> {animal.tipo}
              </p>
              <p>
                <strong>Raza:</strong> {animal.raza || "Sin especificar"}
              </p>
              <p>
                <strong>Edad:</strong> {animal.edad} años
              </p>
              <p>
                <strong>Peso:</strong> {animal.peso ? `${animal.peso} kg` : "Sin especificar"}
              </p>
              <p>
                <strong>Descripción:</strong> {animal.descripcion || "Sin descripción proporcionada"}
              </p>
              <p>
                <strong>Plan:</strong> {animal.plan ? animal.plan.nombre : "Sin plan contratado"}
              </p>
              <p>
                <strong>Estado:</strong> {animal.estado}
              </p>
              <p>
                <strong>Última visita:</strong> {animal.ultimaVisitaVeterinaria ? new Date(animal.ultimaVisitaVeterinaria).toLocaleDateString() : "Sin registros"}
              </p>
              <p>
                <strong>Esterilizado?:</strong> {animal.esterilizado ? "Sí" : "No"}
              </p>
              <p>
                <strong>Fecha de ingreso:</strong>{" "}
                {new Date(animal.creadoEn).toLocaleDateString()}
              </p>

              {/* Mostrar vacunas si existen */}
              {animal.vacunas && animal.vacunas.length > 0 && (
                <>
                  <p><strong>Vacunas:</strong></p>
                  <ul>
                    {animal.vacunas.map((vacuna, index) => (
                      <li key={index}>
                        {vacuna.nombre} (Fecha: {new Date(vacuna.fecha).toLocaleDateString()})
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {/* Mostrar historial médico si existe */}
              {animal.historialMedico && animal.historialMedico.length > 0 && (
                <>
                  <p><strong>Historial médico:</strong></p>
                  <ul>
                    {animal.historialMedico.map((evento, index) => (
                      <li key={index}>{evento}</li>
                    ))}
                  </ul>
                </>
              )}

              <div className="d-flex justify-content-around">
                <Button variant="secondary" onClick={handleBack}>
                  Regresar
                </Button>
                {user?._id == animal.duenio?._id &&
                  (
                    <Button as={Link} to={"/planes"} variant="success">
                      Contratar plan
                    </Button>
                  )}
              </div>

            </Col>

          </Row>
        </Container>
      </div>
    </>
  );
};

export default AnimalDetail;