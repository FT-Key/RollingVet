import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import "../css/BasicModal.css";
import {
  //Productos
  validarNombreProducto,
  validarDescripcion,
  validarPrecio,
  validarStock,
  validarFecha,
  validarCategoria,
  validarImagenURL,
  validarMarca,
  validarModelo,
  validarCalificaciones,
  validarGarantia,
  validarDescuento,
  //Usuarios
  validarNombreUsuario,
  validarContraseniaUsuario,
  validarCorreoElectronico,
  validarNombre,
  validarApellido,
  validarDireccion,
  validarCalle,
  validarCiudad,
  validarEstado,
  validarCodigoPostal,
  validarTelefono,
  validarPreferencias,
  validarPreguntasDeSeguridad,
  validarRespuesta,
  validarBiografia,
  validarEnlacesRedesSociales,
  validarSelect,
} from '../helpers/Validations';
import { putServerData } from "../helpers/ServerCalling";

const BasicModal = ({ type, show, onHide, userData, functionUpdateData, productData }) => {

  const [formData, setFormData] = useState(
    type === 'adminUsers'
    && userData
    || type === 'adminProducts'
    && productData
  );
  const [editedData, setEditedData] = useState(formData);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Actualizar el estado en función del tipo de datos
    if (type === "adminProducts") {
      setFormData(productData);
    } else if (type === "adminUsers") {
      setFormData(userData);
    }
  }, [type, userData, productData]);

  useEffect(() => {
    setEditedData(formData);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;

    const updatedData = { ...editedData };

    if (name.includes('[')) {
      // Si el nombre incluye corchetes, es un campo dentro de un array
      const [mainKey, index, subKey] = name.match(/(\w+)\[(\d+)\]\.(\w+)/).slice(1);
      const idx = parseInt(index, 10);

      updatedData[mainKey] = [
        ...updatedData[mainKey].slice(0, idx),
        {
          ...updatedData[mainKey][idx],
          [subKey]: inputType === 'checkbox' ? checked : value
        },
        ...updatedData[mainKey].slice(idx + 1)
      ];
    } else if (name.includes('.')) {
      // Si el nombre incluye punto, es un campo en un objeto anidado
      const [mainKey, subKey] = name.split('.');
      updatedData[mainKey] = {
        ...updatedData[mainKey],
        [subKey]: inputType === 'checkbox' ? checked : value
      };
    } else {
      // Para campos no anidados
      updatedData[name] = inputType === 'checkbox' ? checked : value;
    }

    setEditedData(updatedData);
  };

  const handleSaveChanges = async () => {
    let validationErrors;

    switch (true) {
      case type === "adminUsers":
        validationErrors = validateUserFields();
        break;

      case type === "adminProducts":
        validationErrors = validateProductFields();
        break;

      default:
        break;
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      console.log(errors);
      return;
    }

    try {
      // Llamar a la función putServerData para actualizar el producto en el servidor
      let updatedData;
      switch (true) {
        case type === "adminUsers":
          updatedData = await putServerData(
            'http://localhost:3001',
            `/usuarios/${editedData._id}`,
            editedData
          );
          break;

        case type === "adminProducts":
          updatedData = await putServerData(
            'http://localhost:3001',
            `/productos/${editedData._id}`,
            editedData
          );
          break;

        default:
          break;
      }


      setFormData(editedData);
      functionUpdateData(prevMark => !prevMark);
      onHide(); // Cerrar el modal
    } catch (error) {
      console.error('Error al guardar el producto:', error);
    }
  };

  function validateUserFields() {
    let validationErrors = {};

    if (!validarNombreUsuario(editedData.nombreUsuario)) {
      validationErrors.nombreUsuario = "Nombre de usuario inválido";
    }

    if (!validarCorreoElectronico(editedData.email)) {
      validationErrors.email = "Email inválido";
    }

    if (!validarContraseniaUsuario(editedData.contrasenia)) {
      validationErrors.contrasenia = "Contraseña inválida";
    }

    if (!validarNombre(editedData.nombre)) {
      validationErrors.nombre = "Nombre inválido";
    }

    if (!validarApellido(editedData.apellido)) {
      validationErrors.apellido = "Apellido inválido";
    }

    if (validarDireccion(editedData.direccion)) {

      if (!validarCalle(editedData.direccion.calle)) {
        validationErrors.calle = "Calle inválida";
      }

      if (!validarCiudad(editedData.direccion.ciudad)) {
        validationErrors.ciudad = "Ciudad inválida";
      }

      if (!validarEstado(editedData.direccion.estado)) {
        validationErrors.estado = "Estado inválido";
      }

      if (!validarCodigoPostal(editedData.direccion.codigoPostal)) {
        validationErrors.codigoPostal = "Código postal inválido";
      }

      if (!validarSelect(editedData.direccion.pais, PAISES)) {
        validationErrors.pais = "País inválido";
      }

    } else {
      validationErrors.direccion = "Dirección inválida";
    }

    if (!validarTelefono(editedData.telefono)) {
      validationErrors.telefono = "Teléfono inválido";
    }

    if (validarPreferencias(editedData.preferencias)) {

      if (!validarSelect(editedData.preferencias.idioma, IDIOMAS)) {
        validationErrors.idioma = "Idioma inválido";
      }

      if (!validarSelect(editedData.preferencias.tema, TEMAS)) {
        validationErrors.tema = "Tema inválido";
      }

    } else {
      validationErrors.preferencias = "Preferencias inválidas";
    }

    editedData.preguntasSeguridad.forEach(conjunto => {
      if (validarPreguntasDeSeguridad(conjunto)) {
        if (!validarSelect(conjunto.pregunta, PREGUNTAS_SEGURIDAD)) {
          validationErrors.pregunta = "Pregunta de seguridad inválida";
        }

        if (!validarRespuesta(conjunto.respuesta)) {
          validationErrors.respuesta = "Respuesta inválida";
        }
      } else {
        validationErrors.preguntasSeguridad = "Campo incompleto en pregunta de seguridad";
      }
    })

    if (!validarBiografia(editedData.biografia)) {
      validationErrors.biografia = "Biografía inválida";
    }

    if (!validarEnlacesRedesSociales(editedData.enlacesRedesSociales)) {
      validationErrors.enlacesRedesSociales = "Enlaces de redes sociales inválidos";
    }

    if (!validarSelect(editedData.estadoSuscripcion, ESTADOS_SUSCRIPCION)) {
      validationErrors.estadoSuscripcion = "Estado de suscripción inválido";
    }

    if (!validarSelect(editedData.region, REGIONES)) {
      validationErrors.region = "Región inválida";
    }

    if (!validarSelect(editedData.rol, ROLES)) {
      validationErrors.rol = "Rol inválido";
    }

    return validationErrors;
  }

  function validateProductFields() {
    let validationErrors = {};

    if (!validarNombreProducto(editedData.name)) {
      validationErrors.name = "Nombre de producto inválido";
    }

    if (!validarPrecio(editedData.price)) {
      validationErrors.price = "Precio inválido";
    }

    if (!validarDescripcion(editedData.description)) {
      validationErrors.description = "Descripción inválida";
    }

    if (!validarCategoria(editedData.category)) {
      validationErrors.category = "Categoría inválida";
    }

    if (!validarStock(editedData.stock)) {
      validationErrors.stock = "Stock inválido";
    }

    if (!validarMarca(editedData.brand)) {
      validationErrors.brand = "Marca inválida";
    }

    if (!validarModelo(editedData.model)) {
      validationErrors.model = "Modelo inválido";
    }

    if (!validarImagenURL(editedData.imageUrl)) {
      validationErrors.imageUrl = "URL de la imagen inválida";
    }

    if (!validarCalificaciones(editedData.ratings)) {
      validationErrors.ratings = "Calificaciones inválidas";
    }

    if (!validarGarantia(editedData.warranty)) {
      validationErrors.warranty = "Garantía inválida";
    }

    if (!validarFecha(editedData.releaseDate)) {
      validationErrors.releaseDate = "Fecha de lanzamiento inválida";
    }

    if (!validarDescuento(editedData.discount)) {
      validationErrors.discount = "Descuento inválido";
    }

    return validationErrors;
  };

  return (
    <Modal show={show} onHide={onHide} aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {type === "adminUsers"
            && `Editando usuario: ${formData.nombreUsuario}`
            || type === "adminProducts"
            && `Editando Producto: ${formData.name}`
            || "Modal Title"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>

        {type === "adminUsers" && (
          <Container fluid className='container-adminUsers'>
            <div>
              <p className='m-0'>ID: {editedData.id || "ID"}</p>
            </div>
            <div>
              <label>Nombre de Usuario</label>
              <input
                type="text"
                name="nombreUsuario"
                value={editedData.nombreUsuario || ""}
                onChange={handleChange}
                placeholder="Nombre de Usuario"
              />
            </div>
            <div>
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={editedData.email || ""}
                onChange={handleChange}
                placeholder="Email"
              />
            </div>
            <div>
              <label>Contraseña</label>
              <input
                type="password"
                name="contrasenia"
                value={editedData.contrasenia || ""}
                placeholder={editedData.contrasenia ? editedData.contrasenia.replace(/./g, '*') : "Contraseña"}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Nombre</label>
              <input
                type="text"
                name="nombre"
                value={editedData.nombre || ""}
                onChange={handleChange}
                placeholder="Nombre"
              />
            </div>
            <div>
              <label>Apellido</label>
              <input
                type="text"
                name="apellido"
                value={editedData.apellido || ""}
                onChange={handleChange}
                placeholder="Apellido"
              />
            </div>
            <div>
              <label>Dirección</label>
              <input
                type="text"
                name="direccion.calle"
                value={editedData.direccion.calle || ""}
                onChange={handleChange}
                placeholder="Calle"
              />
              <input
                type="text"
                name="direccion.ciudad"
                value={editedData.direccion.ciudad || ""}
                onChange={handleChange}
                placeholder="Ciudad"
              />
              <input
                type="text"
                name="direccion.estado"
                value={editedData.direccion.estado || ""}
                onChange={handleChange}
                placeholder="Estado"
              />
              <input
                type="text"
                name="direccion.codigoPostal"
                value={editedData.direccion.codigoPostal || ""}
                onChange={handleChange}
                placeholder="Código Postal"
              />
              <label>País</label>
              <select
                name="direccion.pais"
                value={editedData.direccion.pais || ""}
                onChange={handleChange}
              >
                {PAISES.map(pais => (
                  <option key={pais} value={pais}>
                    {pais}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Teléfono</label>
              <input
                type="text"
                name="telefono"
                value={editedData.telefono || ""}
                onChange={handleChange}
                placeholder="Teléfono"
              />
            </div>
            <div>
              <label>Preferencias</label>
              <label>Idioma</label>
              <select
                name="preferencias.idioma"
                onChange={handleChange}
                value={editedData.preferencias.idioma || ""}
              >
                {IDIOMAS.map(idioma => (
                  <option key={idioma} value={idioma}>
                    {idioma}
                  </option>
                ))}
              </select>
              <label>Tema</label>
              <select
                name="preferencias.tema"
                onChange={handleChange}
                value={editedData.preferencias.tema || ""}
              >
                {TEMAS.map(tema => (
                  <option key={tema} value={tema}>
                    {tema}
                  </option>
                ))}
              </select>
            </div>
            <div>
              {editedData.preguntasSeguridad.map((preguntaSeguridad, index) => (
                <div key={index}>
                  <label>Pregunta de Seguridad {index + 1}</label>
                  <select
                    name={`preguntasSeguridad[${index}].pregunta`}
                    onChange={handleChange}
                    value={preguntaSeguridad.pregunta || ""}
                  >
                    {PREGUNTAS_SEGURIDAD.map(pregunta => (
                      <option key={pregunta} value={pregunta}>
                        {pregunta}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    name={`preguntasSeguridad[${index}].respuesta`}
                    value={preguntaSeguridad.respuesta || ""}
                    onChange={handleChange}
                    placeholder="Respuesta"
                  />
                </div>
              ))}
            </div>
            <div>
              <label>Biografía</label>
              <textarea
                name="biografia"
                value={editedData.biografia || ""}
                onChange={handleChange}
                placeholder="Biografía"
              />
            </div>
            <div>
              <label>Enlaces a Redes Sociales</label>
              <input
                type="text"
                name="enlacesRedesSociales.twitter"
                value={editedData.enlacesRedesSociales.twitter || ""}
                onChange={handleChange}
                placeholder="Twitter"
              />
              <input
                type="text"
                name="enlacesRedesSociales.linkedin"
                value={editedData.enlacesRedesSociales.linkedin || ""}
                onChange={handleChange}
                placeholder="LinkedIn"
              />
            </div>
            <div>
              <label>Estado de Suscripción</label>
              <select
                name="estadoSuscripcion"
                value={editedData.estadoSuscripcion || ""}
                onChange={handleChange}
              >
                {ESTADOS_SUSCRIPCION.map(estado => (
                  <option key={estado} value={estado}>
                    {estado}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Notificaciones</label>
              <label>Email</label>
              <input
                type="checkbox"
                name="notificaciones.email"
                checked={editedData.notificaciones.email || false}
                onChange={() => setEditedData(prevData => ({
                  ...prevData,
                  notificaciones: {
                    ...prevData.notificaciones,
                    email: !prevData.notificaciones.email
                  }
                }))}
              />
              <label>SMS</label>
              <input
                type="checkbox"
                name="notificaciones.sms"
                checked={editedData.notificaciones.sms || false}
                onChange={() => setEditedData(prevData => ({
                  ...prevData,
                  notificaciones: {
                    ...prevData.notificaciones,
                    sms: !prevData.notificaciones.sms
                  }
                }))}
              />
            </div>
            <div className='flex-row justify-content-start'>
              <label>Autenticación Dos Factores</label>
              <input
                type="checkbox"
                name="autenticacionDosFactores"
                checked={editedData.autenticacionDosFactores || false}
                onChange={() => setEditedData(prevData => ({ ...prevData, autenticacionDosFactores: !prevData.autenticacionDosFactores }))}
              />
            </div>
            <div>
              <label>Región</label>
              <select
                name="region"
                onChange={handleChange}
                value={editedData.region || ""}
              >
                {REGIONES.map(region => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Rol</label>
              <select
                name="rol"
                onChange={handleChange}
                value={editedData.rol || ""}
              >
                {ROLES.map(rol => (
                  <option key={rol} value={rol}>
                    {rol}
                  </option>
                ))}
              </select>
            </div>
          </Container>
        )}

        {type === "adminProducts" && (
          <Container fluid className='container-adminProducts'>
            <div>
              <p className='m-0'>ID: {formData.id}</p>
            </div>
            <div>
              <label>Nombre</label>
              <input
                type="text"
                name="name"
                value={editedData.name || ''}
                onChange={handleChange}
                placeholder="Nombre del producto"
              />
            </div>
            <div>
              <label>Precio</label>
              <input
                type="number"
                name="price"
                value={editedData.price || ''}
                onChange={handleChange}
                placeholder="Precio"
              />
            </div>
            <div>
              <label>Descripción</label>
              <textarea
                name="description"
                value={editedData.description || ''}
                onChange={handleChange}
                placeholder="Descripción del producto"
              />
            </div>
            <div>
              <label>Categoría</label>
              <input
                type="text"
                name="category"
                value={editedData.category || ''}
                onChange={handleChange}
                placeholder="Categoría"
              />
            </div>
            <div>
              <label>Stock</label>
              <input
                type="number"
                name="stock"
                value={editedData.stock || ''}
                onChange={handleChange}
                placeholder="Stock"
              />
            </div>
            <div>
              <label>Marca</label>
              <input
                type="text"
                name="brand"
                value={editedData.brand || ''}
                onChange={handleChange}
                placeholder="Marca"
              />
            </div>
            <div>
              <label>Modelo</label>
              <input
                type="text"
                name="model"
                value={editedData.model || ''}
                onChange={handleChange}
                placeholder="Modelo"
              />
            </div>
            <div>
              <label>Imagen URL</label>
              <input
                type="text"
                name="imageUrl"
                value={editedData.imageUrl || ''}
                onChange={handleChange}
                placeholder="URL de la imagen"
              />
            </div>
            <div>
              <label>Calificaciones</label>
              <input
                type="number"
                name="ratings"
                value={editedData.ratings || ''}
                onChange={handleChange}
                step="0.1"
                min="0"
                max="5"
                placeholder="Calificación (0-5)"
              />
            </div>
            <div>
              <label>Garantía</label>
              <input
                type="text"
                name="warranty"
                value={editedData.warranty || ''}
                onChange={handleChange}
                placeholder="Garantía"
              />
            </div>
            <div>
              <label>Fecha de Lanzamiento</label>
              <input
                type="date"
                name="releaseDate"
                value={editedData.releaseDate || ''}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Descuento</label>
              <input
                type="text"
                name="discount"
                value={editedData.discount || ''}
                onChange={handleChange}
                placeholder="Descuento"
              />
            </div>
          </Container>
        )}

      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={onHide}>Close</Button>
        {(type === "adminUsers" || type === "adminProducts") &&
          <Button onClick={handleSaveChanges}>Guardar cambios</Button>
        }
      </Modal.Footer>
    </Modal>
  );
};

// Constantes para los campos de usuarios

const IDIOMAS = ['Español', 'Inglés', 'Francés', 'Alemán', 'Italiano'];
const TEMAS = ['Claro', 'Oscuro'];
const PREGUNTAS_SEGURIDAD = [
  '¿Cuál es el nombre de tu mascota?',
  '¿Cuál es el nombre de tu primera escuela?',
  '¿Cuál es tu comida favorita?',
  '¿Cuál es tu color favorito?',
  '¿Cuál es tu libro favorito?'
];
const REGIONES = ['en-US', 'es-ES', 'fr-FR', 'de-DE', 'it-IT'];
const ROLES = ['admin', 'cliente'];
const PAISES = [
  "Argentina", "Australia", "Brasil", "Canadá", "Chile", "China", "Colombia",
  "España", "Estados Unidos", "Francia", "India", "Italia", "Japón", "México",
  "Perú", "Reino Unido", "Rusia", "Sudáfrica", "Uruguay", "Venezuela"
];
const ESTADOS_SUSCRIPCION = ["Premium", "Gratis"];

//

export default BasicModal;