import React from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';

const MapComponent = () => {
  const mapStyles = {
    height: "100px",  // Puedes ajustar el tamaño del mapa
    width: "100%"
  };

  const defaultCenter = {
    lat: -26.832928,  // Coordenadas de ejemplo
    lng: -65.194647
  };

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={mapStyles}
        zoom={13}
        center={defaultCenter}
      />
    </LoadScript>
  );
}

export default MapComponent;