import React, { useEffect, useMemo, useState } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import CustomButton from "../components/CustomButton";
import BasicModal from "../components/BasicModal"; // Verifica que la ruta sea correcta
import "../css/AdminAnimals.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { deleteAnimal, getAnimals } from "../helpers/ServerAnimals"; // Cambia esto a la función que obtiene animales
import AnimalImage from "../components/AnimalImage"; // Cambiar el componente de imagen si es necesario
import PaginationComponent from "../components/PaginationComponent";
import { Helmet } from "react-helmet";

const AdminAnimals = () => {
  const [animals, setAnimals] = useState([]);
  const [updateMark, setUpdateMark] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  // PAGINACION
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    let isMounted = true;

    const fetchAnimals = async () => {
      while (true) {
        try {
          const data = await getAnimals(currentPage, limit); // Obtener animales desde el servidor

          if (isMounted) {
            setAnimals(data.animales);
            setTotalPages(
              Math.ceil(
                data.pagination.totalAnimales / (data.pagination.limit || data.pagination.totalAnimales)
              )
            );
          }
          break;
        } catch (error) {
          console.error("Error trayendo animales:", error);
          if (!isMounted) return;
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    };

    fetchAnimals();

    return () => {
      isMounted = false;
    };
  }, [updateMark, currentPage, limit]);

  const handleEditClick = (animal) => {
    setSelectedAnimal(animal);
    setModalShow(true);
  };

  const handleDeleteClick = (animalId) => {
    confirmAlert({
      message: "¿Seguro desea eliminar el animal?",
      buttons: [
        {
          label: "Sí",
          onClick: async () => {
            const apiUrl = import.meta.env.VITE_API_URL;

            try {
              await deleteAnimal(animalId);
              setAnimals(animals.filter((animal) => animal.id !== animalId));
            } catch (error) {
              console.error("Error eliminando animal:", error);
            }

            setUpdateMark((prevMark) => !prevMark);

            const alertContainer = document.querySelector(".react-confirm-alert");
            if (alertContainer) {
              alertContainer.remove();
            }
          },
        },
        {
          label: "No",
          onClick: () => {
            const alertContainer = document.querySelector(".react-confirm-alert");
            if (alertContainer) {
              alertContainer.remove();
            }
          },
        },
      ],
    });
  };

  // Cálculo para agregar espacios vacíos
  const fillEmptySpaces = useMemo(() => {
    return Array(limit - animals.length).fill(null);
  }, [animals.length, limit]);

  return (
    <>
      <Helmet>
        <title>Admin Animales</title>
      </Helmet>
      <Container className="py-3 adminAnimals">
        <Row className="text-center text-white header responsive">
          <Col>Animales</Col>
        </Row>

        <Row className="text-center text-white header normal">
          <Col md={2}>Nombre</Col>
          <Col md={2}>Descripción</Col>
          <Col md={2}>Foto</Col>
          <Col md={1}>Tipo</Col>
          <Col md={2}>Dueño</Col>
          <Col md={1}>Plan</Col>
          <Col md={1}>Editar</Col>
          <Col md={1}>Eliminar</Col>
        </Row>

        {animals.map((animal) => (
          <Row key={animal._id} className="text-center" style={{ background: "white" }}>
            <Col xs={12} md={2}>
              {animal.nombre}
            </Col>
            <Col xs={12} md={2}>
              {animal.descripcion}
            </Col>
            <Col xs={12} md={2}>
              <AnimalImage source={animal.fotoUrl} width="100px" />
            </Col>
            <Col xs={12} md={1}>{animal.tipo}</Col>
            <Col xs={12} md={2}>
              {animal.dueño ? animal.dueño.nombreUsuario : "Sin dueño"}
            </Col>
            <Col xs={12} md={1}>
              {animal.plan}
            </Col>
            <Col xs={12} md={1}>
              <CustomButton
                paddingB={false}
                className={"my-1"}
                variant={"warning"}
                buttonText={"Editar"}
                onClick={() => handleEditClick(animal)}
              />
            </Col>
            <Col xs={12} md={1}>
              <CustomButton
                paddingB={false}
                className={"my-1"}
                btnClassName="btn-delete"
                variant={"danger"}
                buttonText={"X"}
                onClick={() => handleDeleteClick(animal._id)}
              />
            </Col>
          </Row>
        ))}

        {/* Renderizar espacios vacíos para mantener la consistencia visual */}
        {fillEmptySpaces.map((_, index) => (
          <Row key={`empty-${index}`}>
            <Col xs={12} md={2}>
            </Col>
            <Col xs={12} md={2}>
              <img className="void-image" src="/Espacio-transparente.png" alt="vacio" />
            </Col>
            <Col xs={12} md={2}>
            </Col>
            <Col xs={12} md={1}>
            </Col>
            <Col xs={12} md={2}>
            </Col>
            <Col xs={12} md={1}>
            </Col>
            <Col xs={12} md={1}>
            </Col>
            <Col xs={12} md={1}>
            </Col>
          </Row>
        ))}

        {selectedAnimal && (
          <BasicModal
            type="adminAnimals"
            show={modalShow}
            functionUpdateData={setUpdateMark}
            onHide={() => setModalShow(false)}
            animalData={selectedAnimal} // Pasar los datos del animal
          />
        )}
      </Container>

      <PaginationComponent
        totalPages={totalPages}
        currentPage={currentPage}
        setPage={setCurrentPage}
      />
    </>
  );
};

export default AdminAnimals;