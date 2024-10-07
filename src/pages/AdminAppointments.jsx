import React, { useState, useEffect, useMemo } from 'react';
import { Table, Button, Form, Container } from 'react-bootstrap';
import { fetchServerData, putServerData } from '../helpers/ServerCalling';
import { getToken } from '../helpers/Token.helper';
import '../css/AdminAppointments.css';
import AppointmentWeek from '../components/AppointmentWeek';
import PaginationComponent from '../components/PaginationComponent';
import { getAppointments, getOneAppointment } from '../helpers/ServerAppointments';
import { Helmet } from 'react-helmet-async';

const AdminAppointments = () => {
  const [turnos, setTurnos] = useState([]); // Turnos aplanados para la página actual
  const [fechaTurnos, setFechaTurnos] = useState([]); // Guardar las 20 fechas con turnos
  const [fecha, setFecha] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Convierte la fecha a 'YYYY-MM-DD'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // PAGINACION
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(1); // Cambia esto al límite que prefieras para cada página
  const [totalPages, setTotalPages] = useState(1);

  // Función para obtener turnos de 20 fechas
  const obtenerTurnos = async (fecha = '') => {
    setLoading(true);
    setError('');

    try {
      let response;
      if (!fecha) {
        response = await getAppointments(1, 20); // Traemos 20 fechas con turnos de una sola vez
      } else {
        response = await getOneAppointment(fecha);
      }

      // Asegurarse de que response exista y tenga la estructura esperada
      if (!response) {
        throw new Error('No se recibió respuesta del servidor.');
      }

      // Asegurarse de que response sea siempre un array
      if (fecha && !response.fechaTurnos && response._id) {
        response.fechaTurnos = [response];  // Si es un objeto, lo convierte en un array
        setCurrentPage(1);
        setTotalPages(1);
      } else if (response.fechaTurnos) {
        setFechaTurnos(response.fechaTurnos); // Guardamos las fechas con turnos
        setTotalPages(response.pagination.totalTurnos);
      }

      // Aplanar los turnos de la página actual
      aplanarTurnos(response.fechaTurnos, currentPage);
    } catch (err) {
      console.error(err); // Log del error para depuración
      if (err.message === "No se recibió respuesta del servidor.") {
        setError('La fecha no tiene turnos habilitados.');
        setTurnos([]);
      } else {
        setError('Error al obtener los turnos.');
      }
    } finally {
      setLoading(false);
    }
  };

  const aplanarTurnos = (fechas, pagina) => {
    const turnosPorPagina = limit;
    const inicio = (pagina - 1) * turnosPorPagina;
    const fin = inicio + turnosPorPagina;

    // Aplanar solo los turnos de las fechas correspondientes a la página actual
    const turnosAplanados = fechas.slice(inicio, fin).flatMap(item =>
      Array.isArray(item.turnos) ? item.turnos.map(turno => ({
        fecha: item.fecha,
        ...turno
      })) : [] // Si no es un array, devuelve un array vacío
    );

    setTurnos(turnosAplanados);
  };

  useEffect(() => {
    if (fechaTurnos.length > 0) {
      aplanarTurnos(fechaTurnos, currentPage);
    } else {
      obtenerTurnos();
    }
  }, [currentPage, limit, fechaTurnos]);

  const handleFechaChange = (e) => {
    setFecha(e.target.value);
  };

  const handleBuscarClick = () => {
    // Al hacer una búsqueda por fecha, resetear a la página 1
    setCurrentPage(1);
    obtenerTurnos(fecha);
  };

  const handleCompletarClick = async (turnoId) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const token = getToken();

    try {
      const body = {
        estado: 'completado'
      };
      await putServerData(apiUrl, `/turnos/modificarTurno/${turnoId}`, body, token);
      // Actualiza la lista de turnos después de completar
      obtenerTurnos(fecha);
    } catch (error) {
      setError('Error al completar el turno.');
    }
  };

  const handleLiberarClick = async (turnoId) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const token = getToken();

    try {
      const body = {
        estado: 'libre',
        usuario: null,
        descripcion: '',
        tipoAtencion: 'Consulta de producto',
        modalidad: 'online'
      };
      await putServerData(apiUrl, `/turnos/modificarTurno/${turnoId}`, body, token);
      // Actualiza la lista de turnos después de liberar
      obtenerTurnos(fecha);
    } catch (error) {
      setError('Error al liberar el turno.');
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Turnos</title>
      </Helmet>
      <Container className='adminAppointments'>
        <h1>Administrar Turnos</h1>
        <div className='d-flex justify-content-center align-items-center'>
          <AppointmentWeek />
        </div>
        <Form>
          <Form.Group className='d-flex justify-content-center align-items-end'>
            <div className='d-flex flex-column justify-content-center align-items-center'>
              <Form.Label htmlFor="fecha">Fecha:</Form.Label>
              <div className='d-flex justify-content-center align-items-center'>
                <Form.Control
                  type="date"
                  id="fecha"
                  value={fecha}
                  onChange={handleFechaChange}
                  className="mx-sm-3"
                />
                <Button variant="primary" onClick={handleBuscarClick}>
                  Buscar
                </Button>
              </div>
            </div>
          </Form.Group>
        </Form>

        {loading && <></>}
        {error && <p className="text-danger">{error}</p>}

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Usuario</th>
              <th>Estado</th>
              <th>Descripción</th>
              <th>Completar</th>
              <th>Cancelar</th>
            </tr>
          </thead>
          <tbody>
            {turnos.length > 0 ? (
              <>
                {turnos.map((turno, index) => (
                  <tr key={index}>
                    <td>{new Date(turno.fecha).toLocaleDateString()}</td>
                    <td>{turno.hora}</td>
                    <td className={`${!turno.usuario && 'turnoNoAsignado'}`}>
                      {turno.usuario ? turno.usuario.nombre : 'No asignado'}
                    </td>
                    <td className={`${ESTADOS_TURNO_COLOR[turno.estado]}`}>
                      {turno.estado.charAt(0).toUpperCase() + turno.estado.slice(1)}
                    </td>
                    <td>{turno.descripcion || 'Sin descripcion proporcionada.'}</td>
                    <td className={`${!['pendiente', 'confirmado'].includes(turno.estado) && 'sinAcciones'}`}>
                      {['pendiente', 'confirmado'].includes(turno.estado) ? (
                        <Button
                          variant="success"
                          onClick={() => handleCompletarClick(turno._id)}
                        >
                          Completar
                        </Button>
                      ) : (
                        'Sin acciones'
                      )}
                    </td>
                    <td className={`${!['pendiente', 'cancelado', 'confirmado'].includes(turno.estado) && 'sinAcciones'}`}>
                      {['pendiente', 'cancelado', 'confirmado', 'completado'].includes(turno.estado) ? (
                        <Button
                          variant="warning"
                          onClick={() => handleLiberarClick(turno._id)}
                        >
                          Liberar
                        </Button>
                      ) : (
                        'Sin acciones'
                      )}
                    </td>
                  </tr>
                ))}
              </>
            ) : (
              <tr>
                <td colSpan="7">No hay turnos disponibles.</td>
              </tr>
            )}
          </tbody>
        </Table>
      </Container>
      <PaginationComponent
        totalPages={totalPages}
        currentPage={currentPage}
        setPage={setCurrentPage}
      />
    </>
  );
};

const ESTADOS_TURNO_COLOR = {
  libre: 'turnoLibre',
  pendiente: 'turnoPendiente',
  completado: 'turnoCompletado',
  cancelado: 'turnoCancelado',
  confirmado: 'turnoConfirmado',
};

export default AdminAppointments;