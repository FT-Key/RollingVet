import React, { useEffect, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import CustomButton from '../components/CustomButton';
import BasicModal from '../components/BasicModal'; // Verifica que la ruta sea correcta
import '../css/AdminUsers.css';
import { fetchServerData, putServerData, deleteServerData } from '../helpers/ServerCalling';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [updateMark, setUpdateMark] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    let isMounted = true; // Variable para saber si el componente está montado
    const apiUrl = import.meta.env.VITE_API_URL;

    const fetchUsers = async () => {
      while (true) {
        try {
          const data = await fetchServerData(apiUrl, '/usuarios');
          if (isMounted) {
            setUsers(data);
          }
          break; // Salir del bucle si la petición es exitosa
        } catch (error) {
          console.error('Error trayendo usuarios:', error);
          if (!isMounted) return; // Salir si el componente se desmontó
          await new Promise(resolve => setTimeout(resolve, 1000)); // Esperar 1 segundo antes de reintentar
        }
      }
    };

    fetchUsers();

    return () => {
      isMounted = false; // Marcar como desmontado al limpiar el efecto
    };
  }, [updateMark]);

  const BLOQUEADO_CONFIG = {
    true: { text: 'Desbloquear', color: 'success' },
    false: { text: 'Bloquear', color: 'danger' },
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setModalShow(true);
  };

  const handleToggleLockClick = async (user) => {
    try {
      const updatedUser = { ...user, bloqueado: !user.bloqueado };
      await putServerData('http://localhost:3001', `/usuarios/${user._id}`, updatedUser);
      setUpdateMark(prevMark => !prevMark);
    } catch (error) {
      console.error('Error actualizando estado bloqueado del usuario:', error);
    }
  };

  const handleDeleteClick = (userId) => {
    confirmAlert({
      message: '¿Seguro desea eliminar el usuario?',
      buttons: [
        {
          label: 'Sí',
          onClick: async () => {
            try {
              await deleteServerData('http://localhost:3001', `/usuarios/${userId}`);
              setUsers(users.filter(user => user.id !== userId));
            } catch (error) {
              console.error('Error eliminando usuario:', error);
            }

            // Elimina el contenedor del alert del DOM después de cerrar el alert
            const alertContainer = document.querySelector('.react-confirm-alert');
            if (alertContainer) {
              alertContainer.remove();
            }
          }
        },
        {
          label: 'No',
          onClick: () => {
            // Elimina el contenedor del alert del DOM después de cerrar el alert
            const alertContainer = document.querySelector('.react-confirm-alert');
            if (alertContainer) {
              alertContainer.remove();
            }
          }
        }
      ]
    });
  };

  return (
    <>
      <Container className='py-3'>
        <Row className='text-center text-white header responsive'>
          <Col>Usuarios</Col>
        </Row>

        <Row className='text-center text-white header normal'>
          <Col md={1}>ID</Col>
          <Col md={2}>Nombre de Usuario</Col>
          <Col md={1}>Nombre</Col>
          <Col md={3}>Email</Col>
          <Col md={2}>Bloqueado</Col>
          <Col md={2}>Editar</Col>
          <Col md={1}>Eliminar</Col>
        </Row>

        {users.map(user => (
          <Row key={user.id} className='text-center' style={{ background: "white" }}>
            <Col xs={12} md={1}>{user.id}</Col>
            <Col xs={12} md={2}>{user.nombreUsuario}</Col>
            <Col xs={12} md={1}>{`${user.nombre} ${user.apellido}`}</Col>
            <Col xs={12} md={3}>{user.email}</Col>
            <Col xs={12} md={2}>
              <CustomButton
                paddingB={false}
                className={'my-1'}
                variant={BLOQUEADO_CONFIG[user.bloqueado].color}
                buttonText={BLOQUEADO_CONFIG[user.bloqueado].text}
                onClick={() => handleToggleLockClick(user)}
              />
            </Col>
            <Col xs={12} md={2}>
              <CustomButton
                paddingB={false}
                className={'my-1'}
                variant={"warning"}
                buttonText={"Editar"}
                onClick={() => handleEditClick(user)}
              />
            </Col>
            <Col xs={12} md={1}>
              <CustomButton
                paddingB={false}
                className={'my-1'}
                btnClassName='btn-delete'
                variant={"danger"}
                buttonText={"X"}
                onClick={() => handleDeleteClick(user._id)}
              />
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
    </>
  );
}

export default AdminUsers;