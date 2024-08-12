import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchServerData } from '../helpers/ServerCalling';

const ServerResponse = () => {
  const [respuesta, setRespuesta] = useState(null);
  const location = useLocation();
  
  // Extraer la ruta, el dominio y las tags de los parámetros de consulta
  const queryParams = new URLSearchParams(location.search);
  const ruta = queryParams.get('ruta') || null; // Valor por defecto si no se proporciona
  const apiUrl = import.meta.env.VITE_API_URL;
  const dominio = queryParams.get('dominio') || apiUrl; // Valor por defecto
  const tags = queryParams.get('tags') ? JSON.parse(decodeURIComponent(queryParams.get('tags'))) : []; // Extraer y parsear las tags

  // Función para filtrar las claves especificadas en tags de forma recursiva
  const filterKeys = (obj, keys) => {
    // Paso 1: Comprobar si el objeto es nulo, indefinido o no es un objeto
    if (!obj || typeof obj !== 'object') return obj;

    // Paso 2: Comprobar si el objeto es un array
    if (Array.isArray(obj)) {
      // Si es un array, mapear cada elemento del array aplicando filterKeys recursivamente
      return obj.map(item => filterKeys(item, keys));
    }

    // Paso 3: Filtrar las claves del objeto que están en el array keys
    return Object.keys(obj)
      .filter(key => keys.includes(key))
      .reduce((acc, key) => {
        // Paso 4: Aplicar filterKeys recursivamente a cada valor del objeto
        acc[key] = filterKeys(obj[key], keys);
        return acc;
      }, {});
  };

  // Función para formatear el JSON
  const formatJson = (obj) => {
    if (tags.length) {
      const filteredObj = filterKeys(obj, tags);
      return JSON.stringify(filteredObj, null, 2);
    } else {
      return JSON.stringify(obj, null, 2);
    }
  };

  useEffect(() => {
    if (ruta) {
      fetchServerData(dominio, ruta)
        .then(data => setRespuesta(data))
        .catch(error => {
          console.error('Error:', error);
        });
    }
  }, [dominio, ruta]);

  return (
    <>
      {respuesta && <pre className='fs-7' style={styles.pre}>{formatJson(respuesta)}</pre>}
    </>
  );
};

const styles = {
  pre: {
    whiteSpace: "pre-wrap",
    wordWrap: "break-word",
  },
};

export default ServerResponse;
