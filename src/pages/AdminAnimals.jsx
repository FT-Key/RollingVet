import React, { useEffect, useMemo, useState } from "react";
import CustomButton from "../components/CustomButton";
import BasicModal from "../components/BasicModal";
import "../css/AdminAnimals.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { deleteAnimal, getAnimals } from "../helpers/ServerAnimals";
import AnimalImage from "../components/AnimalImage";
import PaginationComponent from "../components/PaginationComponent";
import { Helmet } from 'react-helmet-async';
import { Col, Container, Row, Button } from "react-bootstrap";

const AdminAnimals = () => {
  const emptyAnimal = {
    nombre: "",
    fotoUrl: "",
    tipo: "Perro",
    raza: "",
    edad: 0.5, // Usualmente números deben inicializarse con null
    genero: "Macho",
    descripcion: "",
    estado: "En Adopción",
    esterilizado: false,
    peso: 0.5, // Para números, null es adecuado si no hay valor
    plan: null,
    historialMedico: [], // Array vacío para el historial médico
    nuevoEventoHistorial: "",
    vacunas: [], // Array vacío para las vacunas
    ultimaVisitaVeterinaria: new Date(), // Usamos new Date() para fechas
    creadoEn: new Date(), // Fecha de creación en el momento actual
    actualizadoEn: new Date(), // Fecha de actualización en el momento actual
  };
  const [allAnimals, setAllAnimals] = useState([]); // Animales traídos del servidor
  const [currentAnimals, setCurrentAnimals] = useState([]); // Animales mostrados en la página actual
  const [updateMark, setUpdateMark] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [isNew, setIsNew] = useState(false)
  // PAGINACION
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 5; // Número de animales por página
  const [totalPages, setTotalPages] = useState(1);
  const [totalAnimalesServidor, setTotalAnimalesServidor] = useState(0); // Total de animales disponibles en el servidor
  const [fetchedAnimalsCount, setFetchedAnimalsCount] = useState(0); // Cantidad de animales cargados

  const ANIMAL_BATCH_SIZE = 50;

  useEffect(() => {
    const fetchInitialAnimals = async () => {
      try {
        const data = await getAnimals(1, ANIMAL_BATCH_SIZE); // Trae los primeros 50 animales
        setAllAnimals(data.animales);
        setTotalAnimalesServidor(data.pagination.totalAnimales);
        setFetchedAnimalsCount(data.animales.length);
        setTotalPages(Math.ceil(data.pagination.totalAnimales / limit)); // Calcula el total de páginas en base a los animales en el servidor
      } catch (error) {
        console.error("Error trayendo animales:", error);
      }
    };

    fetchInitialAnimals();
  }, [updateMark]);

  useEffect(() => {
    const start = (currentPage - 1) * limit;
    const end = start + limit;

    // Verifica si se necesitan más animales del servidor
    if (end > fetchedAnimalsCount && fetchedAnimalsCount < totalAnimalesServidor) {
      // Llamar al servidor para obtener más animales
      const fetchMoreAnimals = async () => {
        try {
          const data = await getAnimals(fetchedAnimalsCount / limit + 1, ANIMAL_BATCH_SIZE); // Solicitar los próximos 50 animales
          setAllAnimals((prevAnimals) => [...prevAnimals, ...data.animales]); // Agregar los nuevos animales
          setFetchedAnimalsCount(fetchedAnimalsCount + data.animales.length);
        } catch (error) {
          console.error("Error trayendo más animales:", error);
        }
      };

      fetchMoreAnimals();
    } else {
      setCurrentAnimals(allAnimals.slice(start, end)); // Animales a mostrar en la página actual
    }
  }, [currentPage, allAnimals, fetchedAnimalsCount, totalAnimalesServidor]);

  const handleEditClick = (animal) => {
    if (animal == emptyAnimal) {
      setIsNew(true)
    } else {
      setIsNew(false)
    }
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
              setAllAnimals(allAnimals.filter((animal) => animal.id !== animalId));
              setUpdateMark((prevMark) => !prevMark);
            } catch (error) {
              console.error("Error eliminando animal:", error);
            }
          },
        },
        {
          label: "No",
        },
      ],
    });
  };

  const fillEmptySpaces = useMemo(() => {
    return Array(limit - currentAnimals.length).fill(null);
  }, [currentAnimals.length, limit]);

  return (
    <>
      <Helmet>
        <title>Admin Animales</title>
      </Helmet>
      <Container className="py-3 adminAnimals">

        <div className="d-flex justify-content-end  my-2">
          <Button
            className={""}
            variant={"primary"}
            onClick={() => handleEditClick(emptyAnimal)}
          >
            Nuevo
          </Button>
        </div>

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
          <Col md={1}>Editar</Col>
          <Col md={1}>Eliminar</Col>
        </Row>

        {currentAnimals.map((animal) => (
          <Row key={animal._id} className="text-center" style={{ background: "white" }}>
            <Col xs={12} md={2}>
              {animal.nombre}
            </Col>
            <Col xs={12} md={2}>
              {animal.descripcion || "Sin descripción"}
            </Col>
            <Col xs={12} md={2}>
              <AnimalImage source={animal.fotoUrl} alternative={animal.nombre} width="100px" />
            </Col>
            <Col xs={12} md={1}>{animal.tipo}</Col>
            <Col xs={12} md={2}>
              {animal.duenio ? animal.duenio.nombre : "Sin duenio"}
            </Col>
            <Col xs={12} md={1}>
              {animal.plan ? animal.plan.nombre : "Sin plan"}
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

        {fillEmptySpaces.map((_, index) => (
          <Row className="empty" key={`empty-${index}`}>
            <Col xs={12} md={2}>void</Col>
            <Col xs={12} md={2}>void</Col>
            <Col xs={12} md={2}>
              <img className="void-image" src="/Espacio-transparente.png" alt="vacio" />
            </Col>
            <Col xs={12} md={1}>void</Col>
            <Col xs={12} md={2}>void</Col>
            <Col xs={12} md={1}>void</Col>
            <Col xs={12} md={1}>
              <CustomButton
                paddingB={false}
                className={"my-1"}
                variant={"warning"}
                buttonText={"Editar"}
              />
            </Col>
            <Col xs={12} md={1}>
              <CustomButton
                paddingB={false}
                className={"my-1"}
                btnClassName="btn-delete"
                variant={"danger"}
                buttonText={"X"}
              />
            </Col>
          </Row>
        ))}

        {selectedAnimal && (
          <BasicModal
            type="adminAnimals"
            show={modalShow}
            functionUpdateData={setUpdateMark}
            onHide={() => setModalShow(false)}
            animalData={selectedAnimal}
            isNew={isNew}
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