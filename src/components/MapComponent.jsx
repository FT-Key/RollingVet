import React from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

// Define el array de libraries fuera del componente
const libraries = ['places']; // Agrega más bibliotecas si es necesario

const MapComponent = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries, // Usa la variable estática para evitar la recreación del array
  });

  const mapStyles = {
    height: "100px",
    width: "100%",
  };

  const defaultCenter = {
    lat: -26.832928,
    lng: -65.194647,
  };

  if (!isLoaded) {
    return <div>Cargando mapa...</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={mapStyles}
      zoom={13}
      center={defaultCenter}
    />
  );
};

export default MapComponent;