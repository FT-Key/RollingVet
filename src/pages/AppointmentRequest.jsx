import React, { useState, useEffect } from 'react';
import { postServerData, fetchServerData } from '../helpers/ServerCalling';
import '../css/AppointmentRequest.css';
import { getToken } from '../helpers/Token.helper';

const TIPOS_ATENCION = [
  'Consulta de producto',
  'Soporte técnico',
  'Asesoría en compras',
  'Revisión de producto',
  'Consulta sobre garantía',
  'Atención post-venta',
  'Asesoría en productos exclusivos',
];

const AppointmentRequest = () => {
  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Argentina/Buenos_Aires' });

  const [fecha, setFecha] = useState(today);
  const [tipoAtencion, setTipoAtencion] = useState(TIPOS_ATENCION[0]);
  const [descripcion, setDescripcion] = useState('');
  const [turnos, setTurnos] = useState([]);
  const [horaSeleccionada, setHoraSeleccionada] = useState('');
  const [modalidad, setModalidad] = useState('online'); // Valor por defecto
  const [updateMark, setUpdateMark] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (fecha) {
      fetchTurnos(fecha);
    }
  }, [fecha, updateMark]);

  const fetchTurnos = async (fecha) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const token = getToken();

    try {
      const response = await fetchServerData(apiUrl, `/turnos/obtener/${fecha}`, token);
      setTurnos(response.turnos || []);
      setErrorMessage('');
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          setTurnos([]);
          setErrorMessage('No se encontraron turnos para la fecha especificada.');
        } else if (error.response.status === 400 && error.response.data.message) {
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage('Error al obtener los turnos.');
        }
      } else if (error.request) {
        setErrorMessage('Error en la solicitud.');
      } else {
        setErrorMessage('Error al configurar la solicitud.');
      }
    }
  };

  const handleCheckboxChange = (hora) => {
    setHoraSeleccionada(hora);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiUrl = import.meta.env.VITE_API_URL;
    const token = getToken();

    if (!horaSeleccionada) {
      alert('Debe seleccionar una hora para el turno.');
      return;
    }

    try {
      const response = await postServerData(apiUrl, '/turnos/solicitarTurno', {
        fecha,
        hora: horaSeleccionada,
        tipoAtencion,
        descripcion,
        modalidad // Enviar la modalidad seleccionada
      }, token);
      console.log("RESPONSE: ", response)

      if (response && response.turno) {
        alert('Turno solicitado con éxito');
        setHoraSeleccionada('');
        setDescripcion('');
        setModalidad('online');
        setUpdateMark(prev => !prev);
        setErrorMessage('');  // Limpiar mensaje de error
      }
    } catch (error) {
      if (error.response && error.response.data) {
        // Mostrar el mensaje de error del servidor
        setErrorMessage(error.response.data.message || 'Error al solicitar el turno.');
        alert(error.response.data.message);
      } else {
        setErrorMessage('Error al solicitar el turno.');
        alert('Error al solicitar el turno.');
      }
    }
  };

  return (
    <div className='appointmentReq'>
      <form onSubmit={handleSubmit}>
        <input
          type="date"
          value={fecha}
          min={today}
          onChange={(e) => setFecha(e.target.value)}
          required
        />
        <select
          value={tipoAtencion}
          onChange={(e) => setTipoAtencion(e.target.value)}
          required
        >
          {TIPOS_ATENCION.map((tipo, index) => (
            <option key={index} value={tipo}>
              {tipo}
            </option>
          ))}
        </select>
        <div className='turnosContainer'>
          {errorMessage
            ? <p className='text-center m-0 error-message'>{errorMessage}</p> // Mostrar el mensaje de error
            : (turnos.length > 0
              ? turnos.map((turno) => (
                turno.estado != 'cancelado'
                &&
                (<div className='checkboxContainer' key={turno._id}>
                  <label className='w-50' htmlFor={turno.hora}>{turno.hora}</label>
                  {turno.usuario || turno.estado !== 'libre'
                    ? <p className='w-50 m-0'>No disponible</p>
                    : (<input
                      className=' w-50'
                      type="checkbox"
                      id={turno.hora}
                      value={turno.hora}
                      checked={horaSeleccionada === turno.hora}
                      disabled={turno.usuario}
                      onChange={() => handleCheckboxChange(turno.hora)}
                    />)
                  }
                </div>)
              ))
              : <p className='text-center m-0'>No hay turnos disponibles</p>
            )}
        </div>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder='Descripción (opcional)'
        />

        <div className="modalidadContainer">
          <label>
            <input
              type="radio"
              value="online"
              checked={modalidad === 'online'}
              onChange={() => setModalidad('online')}
            />
            Online
          </label>
          <label>
            <input
              type="radio"
              value="presencial"
              checked={modalidad === 'presencial'}
              onChange={() => setModalidad('presencial')}
            />
            Presencial
          </label>
        </div>

        <button type="submit">Solicitar Turno</button>
      </form>
    </div>
  );
};

export default AppointmentRequest;