import React from 'react';
import { postServerData } from '../helpers/ServerCalling';
import { getToken } from '../helpers/Token.helper';
import { Button } from 'react-bootstrap';

const AppointmentWeek = () => {
  const handleCreateTurnosSemanales = async () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const token = getToken();

    try {
      await postServerData(apiUrl, '/turnos/crearTurnosSemanales', {}, token);
      alert('Turnos semanales creados con éxito');
    } catch (error) {
      console.error('Error al crear los turnos semanales:', error);
    }
  };

  return (
    <div className='appointmentWeek'>
      <Button variant={'success'} onClick={handleCreateTurnosSemanales}>
        Crear Turnos Semanales
      </Button>
    </div>
  );
};

export default AppointmentWeek;