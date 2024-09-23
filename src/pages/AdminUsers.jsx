import React, { useEffect, useMemo, useState } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import CustomButton from "../components/CustomButton";
import BasicModal from "../components/BasicModal"; // Verifica que la ruta sea correcta
import "../css/AdminUsers.css";
import { putServerData, deleteServerData } from "../helpers/ServerCalling";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { getUsers } from "../helpers/ServerUsers";
import ProfileImage from "../components/ProfileImage";
import PaginationComponent from "../components/PaginationComponent";
import { Helmet } from "react-helmet";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [updateMark, setUpdateMark] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  // PAGINACION
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    let isMounted = true; // Variable para saber si el componente está montado

    const fetchUsers = async () => {
      while (true) {
        try {
          const data = await getUsers(currentPage, limit);

          if (isMounted) {
            setUsers(data.usuarios);
            setTotalPages(Math.ceil(data.pagination.totalUsuarios / (data.pagination.limit || data.pagination.totalUsuarios)));
          }
          break; // Salir del bucle si la petición es exitosa
        } catch (error) {
          console.error("Error trayendo usuarios:", error);
          if (!isMounted) return; // Salir si el componente se desmontó
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Esperar 1 segundo antes de reintentar
        }
      }
    };

    fetchUsers();

    return () => {
      isMounted = false; // Marcar como desmontado al limpiar el efecto
    };
  }, [updateMark, currentPage, limit]);

  const BLOQUEADO_CONFIG = {
    true: { text: "Desbloquear", color: "success" },
    false: { text: "Bloquear", color: "danger" },
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setModalShow(true);
  };

  const handleToggleLockClick = async (user) => {
    const apiUrl = import.meta.env.VITE_API_URL;

    try {
      const updatedUser = { ...user, bloqueado: !user.bloqueado };
      await putServerData(apiUrl, `/usuarios/${user._id}`, updatedUser);
      setUpdateMark((prevMark) => !prevMark);
    } catch (error) {
      console.error("Error actualizando estado bloqueado del usuario:", error);
    }
  };

  const handleDeleteClick = (userId) => {
    confirmAlert({
      message: "¿Seguro desea eliminar el usuario?",
      buttons: [
        {
          label: "Sí",
          onClick: async () => {
            const apiUrl = import.meta.env.VITE_API_URL;

            try {
              await deleteServerData(apiUrl, `/usuarios/${userId}`);
              setUsers(users.filter((user) => user.id !== userId));
            } catch (error) {
              console.error("Error eliminando usuario:", error);
            }

            setUpdateMark(prevMark => !prevMark);

            // Elimina el contenedor del alert del DOM después de cerrar el alert
            const alertContainer = document.querySelector(
              ".react-confirm-alert"
            );
            if (alertContainer) {
              alertContainer.remove();
            }
          },
        },
        {
          label: "No",
          onClick: () => {
            // Elimina el contenedor del alert del DOM después de cerrar el alert
            const alertContainer = document.querySelector(
              ".react-confirm-alert"
            );
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
    return Array(limit - users.length).fill(null);
  }, [users.length, limit]);

  return (
    <>
      <Helmet>
        <title>Admin Usuarios</title>
      </Helmet>
      <Container className="py-3 adminUsers">
        <Row className="text-center text-white header responsive">
          <Col>Usuarios</Col>
        </Row>

        <Row className="text-center text-white header normal">
          <Col md={1}>ID</Col>
          <Col md={2}>Nombre de Usuario</Col>
          <Col md={2}>Foto Perfil</Col>
          <Col md={1}>Nombre</Col>
          <Col md={2}>Email</Col>
          <Col md={2}>Bloqueado</Col>
          <Col md={1}>Editar</Col>
          <Col md={1}>Eliminar</Col>
        </Row>

        {users.map((user) => (
          <Row
            key={user.id}
            className="text-center"
            style={{ background: "white" }}
          >
            <Col xs={12} md={1}>
              {user.id}
            </Col>
            <Col xs={12} md={2}>
              {user.nombreUsuario}
            </Col>
            <Col xs={12} md={2}>
              <ProfileImage source={user.fotoPerfil} width="100px" />
            </Col>
            <Col xs={12} md={1}>{`${user.nombre} ${user.apellido}`}</Col>
            <Col xs={12} md={2}>
              {user.email}
            </Col>
            <Col xs={12} md={2}>
              <CustomButton
                paddingB={false}
                className={"my-1"}
                variant={BLOQUEADO_CONFIG[user.bloqueado].color}
                buttonText={BLOQUEADO_CONFIG[user.bloqueado].text}
                onClick={() => handleToggleLockClick(user)}
              />
            </Col>
            <Col xs={12} md={1}>
              <CustomButton
                paddingB={false}
                className={"my-1"}
                variant={"warning"}
                buttonText={"Editar"}
                onClick={() => handleEditClick(user)}
              />
            </Col>
            <Col xs={12} md={1}>
              <CustomButton
                paddingB={false}
                className={"my-1"}
                btnClassName="btn-delete"
                variant={"danger"}
                buttonText={"X"}
                onClick={() => handleDeleteClick(user._id)}
              />
            </Col>
          </Row>
        ))}

        {/* Renderizar espacios vacíos para mantener la consistencia visual */}
        {fillEmptySpaces.map((_, index) => (
          <Row key={`empty-${index}`}>
            <Col xs={12} md={1}>
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
            <Col xs={12} md={2}>
            </Col>
            <Col xs={12} md={1}>
            </Col>
            <Col xs={12} md={1}>
            </Col>
          </Row>
        ))}

        {selectedUser && (
          <BasicModal
            type="adminUsers"
            show={modalShow}
            functionUpdateData={setUpdateMark}
            onHide={() => setModalShow(false)}
            userData={selectedUser}
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

export default AdminUsers;
