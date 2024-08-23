import { Container } from "react-bootstrap";
import {
  ESTADOS_SUSCRIPCION,
  IDIOMAS,
  PAISES,
  PREGUNTAS_SEGURIDAD,
  REGIONES,
  ROLES,
  TEMAS,
} from "../utils/usersConst.utils";
import { useState, useEffect } from "react";
import ProfileImage from "./ProfileImage";

const UserFormModal = ({ handleChange, editedData, handleEnabledData }) => {
  const [imageOption, setImageOption] = useState("Agregar URL");
  const [showAddress, setShowAddress] = useState(false);
  const [showSecurityQuestions, setShowSecurityQuestions] = useState(false);
  const [showSocialLinks, setShowSocialLinks] = useState(false);
  const [showImageSection, setShowImageSection] = useState(false);
  const [imageBackUp, setImageBackUp] = useState(editedData.fotoPerfil);

  const handleImageOptionChange = (e) => {
    setImageOption(e.target.value);
  };

  const toggleSection = (section) => {
    switch (section) {
      case "address":
        setShowAddress(!showAddress);
        handleEnabledData("direccion", !showAddress);
        break;
      case "securityQuestions":
        setShowSecurityQuestions(!showSecurityQuestions);
        handleEnabledData("preguntasSeguridad", !showSecurityQuestions);
        break;
      case "socialLinks":
        setShowSocialLinks(!showSocialLinks);
        handleEnabledData("enlacesRedesSociales", !showSocialLinks);
        break;
      case "imageSection":
        setShowImageSection(!showImageSection);
        if (showImageSection) {
          editedData.fotoPerfil = imageBackUp;
        }
        handleEnabledData("fotosPerfil", !showImageSection);
      default:
        break;
    }
  };

  useEffect(() => {
    if (showAddress) {
      handleEnabledData("direccion", true);
    } else {
      handleEnabledData("direccion", false);
    }

    if (showSecurityQuestions) {
      handleEnabledData("preguntasSeguridad", true);
    } else {
      handleEnabledData("preguntasSeguridad", false);
    }

    if (showSocialLinks) {
      handleEnabledData("enlacesRedesSociales", true);
    } else {
      handleEnabledData("enlacesRedesSociales", false);
    }

    if (showImageSection) {
      handleEnabledData("fotosPerfil", true);
    } else {
      handleEnabledData("fotosPerfil", false);
    }
  }, [showAddress, showSecurityQuestions, showSocialLinks, showImageSection]);

  return (
    <Container fluid className="container-adminUsers">
      <div>
        <p className="m-0">ID: {editedData.id || "ID"}</p>
      </div>
      <div>
        <ProfileImage source={editedData.fotoPerfil || ''} />
      </div>
      {/* Botón para mostrar/ocultar la sección de edición de imágenes */}
      <button className="btn btn-secondary mb-2" onClick={() => toggleSection("imageSection")}>
        {showImageSection ? "Cancelar" : "Editar foto de perfil"}
      </button>

      {showImageSection && (

        <div>
          <label>Imagen</label>
          <select value={imageOption} onChange={handleImageOptionChange}>
            <option value="Agregar URL">Agregar URL</option>
            <option value="Subir archivo">Subir archivo</option>
            <option value="Seleccionar existente">Seleccionar imagen ya existente</option>
          </select>

          {imageOption === "Agregar URL" && (
            <div>
              <label>URL de la imagen</label>
              <input
                type="text"
                name="fotoPerfil"
                value={editedData.fotoPerfil || ""}
                onChange={handleChange}
                placeholder="URL de la imagen"
              />
            </div>
          )}

          {imageOption === "Subir archivo" && (
            <div>
              <label>Subir archivo</label>
              <input type="file" name="fotoPerfil" onChange={handleChange} />
            </div>
          )}

          {imageOption === "Seleccionar existente" && (
            <div>
              <label>Seleccionar imagen existente</label>
              <select name="fotoPerfil" value={editedData.fotoPerfil} onChange={handleChange}>
                {editedData.fotosPerfil && editedData.fotosPerfil.map((url, index) => {
                  const shortenedUrl = url.length > 35 ? `${url.substring(0, 35)}...` : url;
                  return (
                    <option key={index} value={url}>
                      {shortenedUrl}
                    </option>
                  );
                })}
              </select>
            </div>
          )}
        </div>
      )}
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
      {/*<div>
        <label>Contraseña</label>
        <input
          type="password"
          name="contrasenia"
          value={editedData.contrasenia || ""}
          placeholder={
            editedData.contrasenia
              ? editedData.contrasenia.replace(/./g, "*")
              : "Contraseña"
          }
          onChange={handleChange}
        />
      </div>*/}
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

      <button className="btn btn-secondary mb-2" onClick={() => toggleSection("address")}>
        {showAddress ? "Ocultar Dirección" : "Mostrar Dirección"}
      </button>
      {showAddress && (
        <div>
          <label>Dirección</label>
          <input
            type="text"
            name="direccion.calle"
            value={editedData.direccion?.calle || ""}
            onChange={handleChange}
            placeholder="Calle"
          />
          <input
            type="text"
            name="direccion.ciudad"
            value={editedData.direccion?.ciudad || ""}
            onChange={handleChange}
            placeholder="Ciudad"
          />
          <input
            type="text"
            name="direccion.estado"
            value={editedData.direccion?.estado || ""}
            onChange={handleChange}
            placeholder="Estado"
          />
          <input
            type="text"
            name="direccion.codigoPostal"
            value={editedData.direccion?.codigoPostal || ""}
            onChange={handleChange}
            placeholder="Código Postal"
          />
          <label>País</label>
          <select
            name="direccion.pais"
            value={editedData.direccion?.pais || ""}
            onChange={handleChange}
          >
            {PAISES.map((pais) => (
              <option key={pais} value={pais}>
                {pais}
              </option>
            ))}
          </select>
        </div>
      )}

      <button className="btn btn-secondary mb-2" onClick={() => toggleSection("securityQuestions")}>
        {showSecurityQuestions ? "Ocultar Preguntas de Seguridad" : "Mostrar Preguntas de Seguridad"}
      </button>
      {showSecurityQuestions && (
        <div>
          {editedData.preguntasSeguridad.map((preguntaSeguridad, index) => (
            <div key={index}>
              <label>Pregunta de Seguridad {index + 1}</label>
              <select
                name={`preguntasSeguridad[${index}].pregunta`}
                onChange={handleChange}
                value={preguntaSeguridad.pregunta || ""}
              >
                {PREGUNTAS_SEGURIDAD.map((pregunta) => (
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
      )}

      <button className="btn btn-secondary mb-2" onClick={() => toggleSection("socialLinks")}>
        {showSocialLinks ? "Ocultar Enlaces a Redes Sociales" : "Mostrar Enlaces a Redes Sociales"}
      </button>
      {showSocialLinks && (
        <div>
          <label>Enlaces a Redes Sociales</label>
          <input
            type="text"
            name="enlacesRedesSociales.twitter"
            value={editedData.enlacesRedesSociales?.twitter || ""}
            onChange={handleChange}
            placeholder="Twitter"
          />
          <input
            type="text"
            name="enlacesRedesSociales.linkedin"
            value={editedData.enlacesRedesSociales?.linkedin || ""}
            onChange={handleChange}
            placeholder="LinkedIn"
          />
        </div>
      )}

      <div>
        <label>Estado de Suscripción</label>
        <select
          name="estadoSuscripcion"
          value={editedData.estadoSuscripcion || ""}
          onChange={handleChange}
        >
          {ESTADOS_SUSCRIPCION.map((estado) => (
            <option key={estado} value={estado}>
              {estado}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Idioma</label>
        <select
          name="idioma"
          value={editedData.idioma || ""}
          onChange={handleChange}
        >
          {IDIOMAS.map((idioma) => (
            <option key={idioma} value={idioma}>
              {idioma}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Región</label>
        <select
          name="region"
          value={editedData.region || ""}
          onChange={handleChange}
        >
          {REGIONES.map((region) => (
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
          value={editedData.rol || ""}
          onChange={handleChange}
        >
          {ROLES.map((rol) => (
            <option key={rol} value={rol}>
              {rol}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Tema</label>
        <select
          name="tema"
          value={editedData.tema || ""}
          onChange={handleChange}
        >
          {TEMAS.map((tema) => (
            <option key={tema} value={tema}>
              {tema}
            </option>
          ))}
        </select>
      </div>
    </Container>
  );
};

export default UserFormModal;