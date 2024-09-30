import React, { useEffect, useMemo, useState } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import CustomButton from "../components/CustomButton";
import BasicModal from "../components/BasicModal";
import "../css/AdminAnimals.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { deleteAnimal, getAnimals } from "../helpers/ServerAnimals";
import AnimalImage from "../components/AnimalImage";
import PaginationComponent from "../components/PaginationComponent";
import { Helmet } from 'react-helmet-async';

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
      try {
        const data = await getAnimals(1, 50); // Cargar todos los animales
        if (isMounted) {
          setAnimals(data.animales);
          setTotalPages(Math.ceil(data.pagination.totalAnimales / data.pagination.limit));
        }
      } catch (error) {
        console.error("Error trayendo animales:", error);
      }
    };

    fetchAnimals();

    return () => {
      isMounted = false;
    };
  }, [updateMark]);

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
            try {
              await deleteAnimal(animalId);
              setAnimals(animals.filter((animal) => animal._id !== animalId));
            } catch (error) {
              console.error("Error eliminando animal:", error);
            }

            setUpdateMark((prevMark) => !prevMark);
          },
        },
        {
          label: "No",
          onClick: () => { },
        },
      ],
    });
  };

  // Filtra los animales para la página actual
  const paginatedAnimals = animals.slice((currentPage - 1) * limit, currentPage * limit);

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
          <Col md={2}>Duenio</Col>
          <Col md={1}>Plan</Col>
          <Col md={1}></Col>
        </Row>

        {paginatedAnimals.map((animal) => (
          <Row className="text-center" key={animal._id}>
            <Col md={2}>{animal.nombre}</Col>
            <Col md={2}>{animal.descripcion}</Col>
            <Col md={2}>
              <AnimalImage animal={animal} />
            </Col>
            <Col md={1}>{animal.tipo}</Col>
            <Col md={2}>{animal.dueno}</Col>
            <Col md={1}>{animal.plan}</Col>
            <Col md={1}>
              <CustomButton
                title={"Modificar"}
                onClick={() => handleEditClick(animal)}
                customClass={"edit-button"}
              />
              <CustomButton
                title={"Eliminar"}
                onClick={() => handleDeleteClick(animal._id)}
                customClass={"delete-button"}
              />
            </Col>
          </Row>
        ))}

        <PaginationComponent
          totalPages={totalPages}
          currentPage={currentPage}
          setPage={setCurrentPage}
        />

        <BasicModal
          show={modalShow}
          onHide={() => setModalShow(false)}
          animal={selectedAnimal}
          setUpdateMark={setUpdateMark}
        />
      </Container>
    </>
  );
};

export default AdminAnimals;