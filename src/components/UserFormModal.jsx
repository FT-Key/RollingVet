import { Container, Form, Button } from "react-bootstrap";
import {
  ESTADOS_SUSCRIPCION,
  IDIOMAS,
  PAISES,
  PREGUNTAS_SEGURIDAD,
  REGIONES,
  ROLES,
  TEMAS,
} from "../utils/usersConst.utils";
import { ESPECIES } from "../utils/animalsConst.utils";
import { useState, useEffect } from "react";
import ProfileImage from "./ProfileImage";

const UserFormModal = ({ handleChange, editedData, handleEnabledData, errors }) => {
  const [imageOption, setImageOption] = useState("Agregar URL");
  const [showAddress, setShowAddress] = useState(false);
  const [showSecurityQuestions, setShowSecurityQuestions] = useState(false);
  const [showSocialLinks, setShowSocialLinks] = useState(false);
  const [showImageSection, setShowImageSection] = useState(false);
  const [imageBackUp, setImageBackUp] = useState(editedData.fotoPerfil);
  const [showPetSection, setShowPetSection] = useState(false);
  const [showNewPetSection, setShowNewPetSection] = useState(false);
  const [petOption, setPetOption] = useState("Agregar nueva mascota");
  const [newPet, setNewPet] = useState({ nombre: "", tipo: "", edad: "", raza: "" });

  const handleNewPetChange = (e) => {
    const { name, value } = e.target;
    setNewPet((prevPet) => ({ ...prevPet, [name.split(".")[1]]: value }));
  };

  const handleAddNewPet = () => {
    if (newPet.nombre && newPet.tipo && newPet.edad) {
      const newPetWithOwner = { ...newPet, dueño: editedData._id };
      const updatedMascotas = [...editedData.mascotas, newPetWithOwner];
      handleChange({ target: { name: "mascotas", value: updatedMascotas } });
      setNewPet({ nombre: "", tipo: "", edad: "", raza: "" });
      toggleSection("newPetSection");
    } else {
      alert("Por favor, completa todos los campos requeridos.");
    }
  };

  const handleDeletePet = (index) => {
    const updatedMascotas = editedData.mascotas.filter((_, i) => i !== index);
    handleChange({ target: { name: "mascotas", value: updatedMascotas } });
  };

  const handleImageOptionChange = (e) => {
    setImageOption(e.target.value);
  };

  const handlePetOptionChange = (e) => {
    setPetOption(e.target.value);
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
        break;
      case "petsSection":
        setShowPetSection(!showPetSection);
        handleEnabledData("mascotas", !showPetSection);
        break;
      case "newPetSection":
        setShowNewPetSection(!showNewPetSection);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    handleEnabledData("direccion", showAddress);
    handleEnabledData("preguntasSeguridad", showSecurityQuestions);
    handleEnabledData("enlacesRedesSociales", showSocialLinks);
    handleEnabledData("fotosPerfil", showImageSection);
    handleEnabledData("mascotas", showPetSection);
  }, [showAddress, showSecurityQuestions, showSocialLinks, showImageSection, showPetSection]);

  return (
    <Container fluid className="container-adminUsers">
      <div>
        <p className="m-0">ID: {editedData.id || "ID"}</p>
      </div>

      <div>
        <ProfileImage source={editedData.fotoPerfil || ''} />
      </div>

      <Button variant="secondary" className="mb-2" onClick={() => toggleSection("imageSection")}>
        {showImageSection ? "Cancelar" : "Editar foto de perfil"}
      </Button>

      {showImageSection && (
        <div>
          <Form.Group>
            <Form.Label>Imagen</Form.Label>
            <Form.Select value={imageOption} onChange={handleImageOptionChange}>
              <option value="Agregar URL">Agregar URL</option>
              <option value="Subir archivo">Subir archivo</option>
              <option value="Seleccionar existente">Seleccionar imagen ya existente</option>
            </Form.Select>
          </Form.Group>

          {imageOption === "Agregar URL" && (
            <Form.Group>
              <Form.Label>URL de la imagen</Form.Label>
              <Form.Control
                type="text"
                name="fotoPerfil"
                value={editedData.fotoPerfil || ""}
                onChange={handleChange}
                placeholder="URL de la imagen"
                isInvalid={!!errors?.fotoPerfil}
              />
              <Form.Control.Feedback type="invalid">
                {errors.fotoPerfil}
              </Form.Control.Feedback>
            </Form.Group>
          )}

          {imageOption === "Subir archivo" && (
            <Form.Group>
              <Form.Label>Subir archivo</Form.Label>
              <Form.Control type="file" name="fotoPerfil" onChange={handleChange} />
            </Form.Group>
          )}

          {imageOption === "Seleccionar existente" && (
            <Form.Group>
              <Form.Label>Seleccionar imagen existente</Form.Label>
              <Form.Select name="fotoPerfil" value={editedData.fotoPerfil} onChange={handleChange}>
                {editedData.fotosPerfil && editedData.fotosPerfil.map((url, index) => {
                  const shortenedUrl = url.length > 35 ? `${url.substring(0, 35)}...` : url;
                  return (
                    <option key={index} value={url}>
                      {shortenedUrl}
                    </option>
                  );
                })}
              </Form.Select>
            </Form.Group>
          )}
        </div>
      )}

      <Form.Group>
        <Form.Label>Nombre de Usuario</Form.Label>
        <Form.Control
          type="text"
          name="nombreUsuario"
          value={editedData.nombreUsuario || ""}
          onChange={handleChange}
          placeholder="Nombre de Usuario"
          isInvalid={!!errors?.nombreUsuario}
        />
        <Form.Control.Feedback type="invalid">
          {errors.nombreUsuario}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group>
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          name="email"
          value={editedData.email || ""}
          onChange={handleChange}
          placeholder="Email"
          isInvalid={!!errors?.email}
        />
        <Form.Control.Feedback type="invalid">
          {errors.email}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group>
        <Form.Label>Nombre</Form.Label>
        <Form.Control
          type="text"
          name="nombre"
          value={editedData.nombre || ""}
          onChange={handleChange}
          placeholder="Nombre"
          isInvalid={!!errors?.nombre}
        />
        <Form.Control.Feedback type="invalid">
          {errors.nombre}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group>
        <Form.Label>Apellido</Form.Label>
        <Form.Control
          type="text"
          name="apellido"
          value={editedData.apellido || ""}
          onChange={handleChange}
          placeholder="Apellido"
          isInvalid={!!errors?.apellido}
        />
        <Form.Control.Feedback type="invalid">
          {errors.apellido}
        </Form.Control.Feedback>
      </Form.Group>

      <Button variant="secondary" className="mb-2" onClick={() => toggleSection("petsSection")}>
        {showPetSection ? "Cancelar" : "Agregar/Eliminar Mascotas"}
      </Button>

      {showPetSection && (
        <div>
          <h3>Mascotas del usuario</h3>
          <ul>
            {editedData.mascotas.map((mascota, index) => (
              <li key={index}>
                {mascota.nombre} ({mascota.tipo})
                <Button variant="danger" onClick={() => handleDeletePet(index)}>X</Button>
              </li>
            ))}
          </ul>

          <Button variant="secondary" className="mb-2" onClick={() => toggleSection("newPetSection")}>
            {showNewPetSection ? "Cancelar" : "Agregar nueva mascota"}
          </Button>

          {showNewPetSection && (
            <div>
              <Form.Group>
                <Form.Label>Nombre de la mascota</Form.Label>
                <Form.Control
                  type="text"
                  name="mascota.nombre"
                  value={newPet.nombre}
                  onChange={handleNewPetChange}
                  placeholder="Nombre"
                  isInvalid={!!errors?.mascota?.nombre}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.mascota?.nombre}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group>
                <Form.Label>Tipo de mascota</Form.Label>
                <Form.Control
                  type="text"
                  name="mascota.tipo"
                  value={newPet.tipo}
                  onChange={handleNewPetChange}
                  placeholder="Tipo"
                  isInvalid={!!errors?.mascota?.tipo}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.mascota?.tipo}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group>
                <Form.Label>Edad</Form.Label>
                <Form.Control
                  type="text"
                  name="mascota.edad"
                  value={newPet.edad}
                  onChange={handleNewPetChange}
                  placeholder="Edad"
                  isInvalid={!!errors?.mascota?.edad}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.mascota?.edad}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group>
                <Form.Label>Raza</Form.Label>
                <Form.Control
                  type="text"
                  name="mascota.raza"
                  value={newPet.raza}
                  onChange={handleNewPetChange}
                  placeholder="Raza"
                  isInvalid={!!errors?.mascota?.raza}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.mascota?.raza}
                </Form.Control.Feedback>
              </Form.Group>

              <Button onClick={handleAddNewPet}>Agregar mascota</Button>
            </div>
          )}
        </div>
      )}

      {showAddress && (
        <div>
          <h3>Dirección</h3>
          <Form.Group>
            <Form.Label>Calle</Form.Label>
            <Form.Control
              type="text"
              name="direccion.calle"
              value={editedData.direccion?.calle || ""}
              onChange={handleChange}
              placeholder="Calle"
              isInvalid={!!errors?.direccion?.calle}
            />
            <Form.Control.Feedback type="invalid">
              {errors.direccion?.calle}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group>
            <Form.Label>Ciudad</Form.Label>
            <Form.Control
              type="text"
              name="direccion.ciudad"
              value={editedData.direccion?.ciudad || ""}
              onChange={handleChange}
              placeholder="Ciudad"
              isInvalid={!!errors?.direccion?.ciudad}
            />
            <Form.Control.Feedback type="invalid">
              {errors.direccion?.ciudad}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group>
            <Form.Label>Estado</Form.Label>
            <Form.Control
              type="text"
              name="direccion.estado"
              value={editedData.direccion?.estado || ""}
              onChange={handleChange}
              placeholder="Estado"
              isInvalid={!!errors?.direccion?.estado}
            />
            <Form.Control.Feedback type="invalid">
              {errors.direccion?.estado}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group>
            <Form.Label>Código Postal</Form.Label>
            <Form.Control
              type="text"
              name="direccion.codigoPostal"
              value={editedData.direccion?.codigoPostal || ""}
              onChange={handleChange}
              placeholder="Código Postal"
              isInvalid={!!errors?.direccion?.codigoPostal}
            />
            <Form.Control.Feedback type="invalid">
              {errors.direccion?.codigoPostal}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group>
            <Form.Label>País</Form.Label>
            <Form.Control
              as="select"
              name="direccion.pais"
              value={editedData.direccion?.pais || ""}
              onChange={handleChange}
              isInvalid={!!errors?.direccion?.pais}
            >
              {PAISES.map((pais, index) => (
                <option key={index} value={pais}>
                  {pais}
                </option>
              ))}
            </Form.Control>
            <Form.Control.Feedback type="invalid">
              {errors.direccion?.pais}
            </Form.Control.Feedback>
          </Form.Group>
        </div>
      )}

      <Button variant="secondary" className="mb-2" onClick={() => toggleSection("securityQuestions")}>
        {showSecurityQuestions ? "Cancelar" : "Agregar Preguntas de Seguridad"}
      </Button>

      {showSecurityQuestions && (
        <div>
          <h3>Preguntas de Seguridad</h3>
          {editedData.preguntasSeguridad?.map((pregunta, index) => (
            <div key={index}>
              <Form.Group>
                <Form.Label>Pregunta {index + 1}</Form.Label>
                <Form.Select
                  name={`preguntasSeguridad.${index}.pregunta`}
                  value={pregunta.pregunta || ""}
                  onChange={handleChange}
                  isInvalid={!!errors?.preguntasSeguridad?.[index]?.pregunta}
                >
                  <option value="">Seleccionar pregunta</option>
                  {PREGUNTAS_SEGURIDAD.map((p, i) => (
                    <option key={i} value={p}>
                      {p}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.preguntasSeguridad?.[index]?.pregunta}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group>
                <Form.Label>Respuesta</Form.Label>
                <Form.Control
                  type="text"
                  name={`preguntasSeguridad.${index}.respuesta`}
                  value={pregunta.respuesta || ""}
                  onChange={handleChange}
                  placeholder="Respuesta"
                  isInvalid={!!errors?.preguntasSeguridad?.[index]?.respuesta}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.preguntasSeguridad?.[index]?.respuesta}
                </Form.Control.Feedback>
              </Form.Group>
            </div>
          ))}
        </div>
      )}

      <Button variant="secondary" className="mb-2" onClick={() => toggleSection("socialLinks")}>
        {showSocialLinks ? "Cancelar" : "Agregar Enlaces a Redes Sociales"}
      </Button>

      {showSocialLinks && (
        <div>
          <h3>Enlaces a Redes Sociales</h3>
          {editedData.enlacesRedesSociales?.map((enlace, index) => (
            <Form.Group key={index}>
              <Form.Label>Red Social {index + 1}</Form.Label>
              <Form.Control
                type="text"
                name={`enlacesRedesSociales.${index}`}
                value={enlace || ""}
                onChange={handleChange}
                placeholder="URL de la red social"
                isInvalid={!!errors?.enlacesRedesSociales?.[index]}
              />
              <Form.Control.Feedback type="invalid">
                {errors.enlacesRedesSociales?.[index]}
              </Form.Control.Feedback>
            </Form.Group>
          ))}
        </div>
      )}

      <Form.Group>
        <Form.Label>Estado de Suscripción</Form.Label>
        <Form.Control
          as="select"
          name="estadoSuscripcion"
          value={editedData.estadoSuscripcion || ""}
          onChange={handleChange}
          isInvalid={!!errors?.estadoSuscripcion}
        >
          {ESTADOS_SUSCRIPCION.map((estado, index) => (
            <option key={index} value={estado}>
              {estado}
            </option>
          ))}
        </Form.Control>
        <Form.Control.Feedback type="invalid">
          {errors.estadoSuscripcion}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group>
        <Form.Label>Idioma</Form.Label>
        <Form.Control
          as="select"
          name="idioma"
          value={editedData.idioma || ""}
          onChange={handleChange}
          isInvalid={!!errors?.idioma}
        >
          {IDIOMAS.map((idioma, index) => (
            <option key={index} value={idioma}>
              {idioma}
            </option>
          ))}
        </Form.Control>
        <Form.Control.Feedback type="invalid">
          {errors.idioma}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group>
        <Form.Label>Tema</Form.Label>
        <Form.Control
          as="select"
          name="tema"
          value={editedData.tema || ""}
          onChange={handleChange}
          isInvalid={!!errors?.tema}
        >
          {TEMAS.map((tema, index) => (
            <option key={index} value={tema}>
              {tema}
            </option>
          ))}
        </Form.Control>
        <Form.Control.Feedback type="invalid">
          {errors.tema}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group>
        <Form.Label>Región</Form.Label>
        <Form.Control
          as="select"
          name="region"
          value={editedData.region || ""}
          onChange={handleChange}
          isInvalid={!!errors?.region}
        >
          {REGIONES.map((region, index) => (
            <option key={index} value={region}>
              {region}
            </option>
          ))}
        </Form.Control>
        <Form.Control.Feedback type="invalid">
          {errors.region}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group>
        <Form.Label>Rol</Form.Label>
        <Form.Control
          as="select"
          name="rol"
          value={editedData.rol || ""}
          onChange={handleChange}
          isInvalid={!!errors?.rol}
        >
          {ROLES.map((rol, index) => (
            <option key={index} value={rol}>
              {rol}
            </option>
          ))}
        </Form.Control>
        <Form.Control.Feedback type="invalid">
          {errors.rol}
        </Form.Control.Feedback>
      </Form.Group>
    </Container>
  );
};

export default UserFormModal;