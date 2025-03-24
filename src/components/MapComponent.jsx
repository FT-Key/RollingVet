import React from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

const libraries = ['places'];

const MapComponent = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
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