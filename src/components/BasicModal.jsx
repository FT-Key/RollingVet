import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useState, useEffect } from "react";
import "../css/BasicModal.css";
import UserFormModal from "./UserFormModal";
import ProductsFormModal from "./ProductsFormModal";
import { validateAnimalFields, validateProductFields, validateUserFields } from "./Validators";
import { postProduct, putProduct, uploadProductImage } from "../helpers/ServerProducts";
import { putUser, uploadProfileImage } from "../helpers/ServerUsers";
import AnimalsFormModal from "./AnimalsFormModal";
import { postAnimal, putAnimal, uploadAnimalImage } from "../helpers/ServerAnimals";

const BasicModal = ({
  type,
  show,
  onHide,
  userData,
  functionUpdateData,
  functionNewUpdatedData,
  productData,
  animalData,
  isNew = false
}) => {
  const [formData, setFormData] = useState(
    (type === "adminUsers" && userData) ||
    (type === "adminProducts" && productData) ||
    (type === "adminAnimals" && animalData)
  );
  const [editedData, setEditedData] = useState(formData);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Restablecer editedData cuando se cierra el modal
    if (!show) {
      setEditedData(formData);
      setErrors({});  // Limpia los errores cuando se cierra el modal
    }
  }, [show, formData]);

  useEffect(() => {
    // Actualizar el estado en función del tipo de datos
    if (type === "adminProducts") {
      setFormData(productData);
    } else if (type === "adminUsers") {
      setFormData(userData);
    } else if (type === "adminAnimals") {
      setFormData(animalData);
    }
  }, [type, userData, productData, animalData]);

  useEffect(() => {
    setEditedData(formData);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value, type: inputType, checked, files } = e.target;
    const updatedData = { ...editedData };

    if (inputType === "file") {
      // Solo almacenar el archivo en una variable temporal, sin modificar el editedData
      if (files && files.length > 0) {

        // Crear un enlace temporal para mostrar la imagen
        const fileUrl = URL.createObjectURL(files[0]);

        updatedData["uploadedFile"] = files[0]; // Guardar temporalmente el archivo
        updatedData[name] = fileUrl;
      }
    } else if (inputType === "date") {
      // Convertir la fecha del input (HTML) al formato de fecha de JavaScript
      updatedData[name] = new Date(value);
    } else if (name.includes("[")) {
      // Lógica para manejar arrays
      const [mainKey, index, subKey] = name
        .match(/(\w+)\[(\d+)\]\.(\w+)/)
        .slice(1);
      const idx = parseInt(index, 10);

      updatedData[mainKey] = [
        ...updatedData[mainKey].slice(0, idx),
        {
          ...updatedData[mainKey][idx],
          [subKey]: inputType === "checkbox" ? checked : value,
        },
        ...updatedData[mainKey].slice(idx + 1),
      ];
    } else if (name.includes(".")) {
      // Lógica para manejar objetos anidados
      const [mainKey, subKey] = name.split(".");
      updatedData[mainKey] = {
        ...updatedData[mainKey],
        [subKey]: inputType === "checkbox" ? checked : value,
      };
    } else {
      // Para campos no anidados
      // Verificación especial para el campo de calificaciones
      if (name === "calificaciones") {
        updatedData[name] = parseFloat(value); // Convertir el valor a float
      } else {
        updatedData[name] = inputType === "checkbox" ? checked : value;
      }
    }

    setEditedData(updatedData);
  };

  const handleSaveChanges = async () => {
    setIsLoading(true); // Inicia el estado de carga
    let validationErrors;

    switch (true) {
      case type === "adminUsers":
        if (typeof editedData.fotoPerfil === "string" && editedData.fotoPerfil.startsWith("blob:")) {
          // Elimina el campo fotoPerfil si comienza con 'blob:'
          delete editedData.fotoPerfil;
        }
        break;

      case type === "adminProducts":
        if (typeof editedData.imagenUrl === "string" && editedData.imagenUrl.startsWith("blob:")) {
          // Elimina el campo imageUrl si comienza con 'blob:'
          delete editedData.imagenUrl;
        }
        break;

      case type === "adminAnimals":
        if (typeof editedData.fotoUrl === "string" && editedData.fotoUrl.startsWith("blob:")) {
          // Elimina el campo imageUrl si comienza con 'blob:'
          delete editedData.fotoUrl;
        }
        break;

      default:
        break;
    }

    switch (true) {
      case type === "adminUsers":
        validationErrors = validateUserFields(editedData);
        break;

      case type === "adminProducts":
        validationErrors = validateProductFields(editedData);
        break;

      case type === "adminAnimals":
        validationErrors = validateAnimalFields(editedData);
        break;

      default:
        break;
    }

    if (validationErrors && Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }

    try {
      let newObjectData;
      const { uploadedFile, ...productDataWithoutFile } = editedData;

      // Hacer la petición PUT para actualizar el producto, excluyendo el archivo
      let updatedData;

      switch (true) {
        case type === "adminUsers":
          updatedData = await putUser(editedData._id, productDataWithoutFile);
          newObjectData = updatedData.usuario;
          break;

        case type === "adminProducts":
          updatedData = await putProduct(editedData._id, productDataWithoutFile);
          newObjectData = updatedData.producto;
          break;

        case type === "adminAnimals":
          updatedData = await putAnimal(editedData._id, productDataWithoutFile);
          break;

        default:
          break;
      }

      // Si hay un archivo seleccionado, realizar la subida en una llamada separada
      if (uploadedFile) {
        const fileData = new FormData();
        fileData.append("image", uploadedFile);  // Importante que sea 'image'

        let uploadResponse;
        switch (true) {
          case type === "adminUsers":
            uploadResponse = await uploadProfileImage(editedData._id, fileData);
            break;

          case type === "adminProducts":
            uploadResponse = await uploadProductImage(editedData._id, fileData);
            break;

          case type === "adminAnimals":
            uploadResponse = await uploadAnimalImage(editedData._id, fileData);
            break;

          default:
            break;
        }

        if (!uploadResponse) {
          throw new Error(uploadResponse.message);
        } else {
          newObjectData = uploadResponse.data;
        }
      }

      setFormData(editedData);
      functionUpdateData((prevMark) => !prevMark);
      if (typeof functionNewUpdatedData === 'function') {
        functionNewUpdatedData(newObjectData);
      }
      onHide(); // Cerrar el modal
    } catch (error) {
      console.error("Error al guardar el producto:", error);
    } finally {
      setIsLoading(false); // Finaliza el estado de carga
    }
  };

  const handleCreate = async () => {
    setIsLoading(true); // Inicia el estado de carga
    let validationErrors;

    switch (true) {
      case type === "adminProducts":
        if (typeof editedData.imagenUrl === "string" && editedData.imagenUrl.startsWith("blob:")) {
          // Elimina el campo imageUrl si comienza con 'blob:'
          delete editedData.imagenUrl;
        }
        break;

      case type === "adminAnimals":
        if (typeof editedData.fotoUrl === "string" && editedData.fotoUrl.startsWith("blob:")) {
          // Elimina el campo imageUrl si comienza con 'blob:'
          delete editedData.fotoUrl;
        }
        break;

      default:
        break;
    }

    switch (true) {
      case type === "adminProducts":
        validationErrors = validateProductFields(editedData);
        break;

      case type === "adminAnimals":
        validationErrors = validateAnimalFields(editedData);
        break;

      default:
        break;
    }

    if (validationErrors && Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }

    try {
      const { uploadedFile, ...productDataWithoutFile } = editedData;

      // Hacer la petición PUT para actualizar el producto, excluyendo el archivo
      let updatedData;

      switch (true) {
        case type === "adminProducts":
          updatedData = await postProduct(productDataWithoutFile);
          break;

        case type === "adminAnimals":
          updatedData = await postAnimal(productDataWithoutFile);
          break;

        default:
          break;
      }

      // Si hay un archivo seleccionado, realizar la subida en una llamada separada
      if (uploadedFile) {
        const fileData = new FormData();
        fileData.append("image", uploadedFile);  // Importante que sea 'image'

        let uploadResponse;
        switch (true) {
          case type === "adminProducts":
            uploadResponse = await uploadProductImage(editedData._id, fileData);
            break;

          case type === "adminAnimals":
            uploadResponse = await uploadAnimalImage(editedData._id, fileData);
            break;

          default:
            break;
        }

        if (!uploadResponse) {
          throw new Error(uploadResponse.message);
        }
      }

      setFormData(editedData);
      functionUpdateData((prevMark) => !prevMark);
      onHide(); // Cerrar el modal
    } catch (error) {
      console.error("Error al guardar el producto:", error);
    } finally {
      setIsLoading(false); // Finaliza el estado de carga
    }
  };

  const handleEnabledData = (section, isEnabled) => {
    // Clonamos editedData para no modificar el estado directamente
    const updatedData = { ...editedData };

    switch (section) {
      case "direccion":
        if (isEnabled) {
          updatedData.direccion = updatedData.direccion || {
            calle: '',
            ciudad: '',
            estado: '',
            codigoPostal: '',
            pais: ''
          };
        } else if (updatedData.direccion) {
          updatedData.direccion = Object.fromEntries(
            Object.entries(updatedData.direccion).filter(([_, value]) => value !== '')
          );
          if (Object.keys(updatedData.direccion).length === 0) {
            delete updatedData.direccion;
          }
        }
        break;

      case "preguntasSeguridad":
        if (isEnabled) {
          updatedData.preguntasSeguridad = updatedData.preguntasSeguridad || [];
        } else if (updatedData.preguntasSeguridad) {
          updatedData.preguntasSeguridad = updatedData.preguntasSeguridad.filter(pregunta =>
            pregunta.pregunta !== '' || pregunta.respuesta !== ''
          );
          if (updatedData.preguntasSeguridad.length === 0) {
            delete updatedData.preguntasSeguridad;
          }
        }
        break;

      case "enlacesRedesSociales":
        if (isEnabled) {
          updatedData.enlacesRedesSociales = updatedData.enlacesRedesSociales || {
            twitter: '',
            linkedin: ''
          };
        } else if (updatedData.enlacesRedesSociales) {
          updatedData.enlacesRedesSociales = Object.fromEntries(
            Object.entries(updatedData.enlacesRedesSociales).filter(([_, value]) => value !== '')
          );
          if (Object.keys(updatedData.enlacesRedesSociales).length === 0) {
            delete updatedData.enlacesRedesSociales;
          }
        }
        break;

      case "fotosPerfil":
        if (isEnabled) {
          updatedData.fotoPerfil = updatedData.fotoPerfil || '';
          updatedData.fotosPerfil = updatedData.fotosPerfil || [];
        } else {
          // Si está deshabilitado, eliminamos ambos campos si están vacíos
          if (!updatedData.fotoPerfil) delete updatedData.fotoPerfil;
          if (!updatedData.fotosPerfil || updatedData.fotosPerfil.length === 0) {
            delete updatedData.fotosPerfil;
          }
        }
        break;

      case "mascotas":
        if (isEnabled) {
          updatedData.mascotas = updatedData.mascotas || [];
        } else {
          // Si está deshabilitado, eliminamos el campo si el array de mascotas está vacío
          if (!updatedData.mascotas || updatedData.mascotas.length === 0) {
            delete updatedData.mascotas;
          }
        }
        break;

      default:
        break;
    }

    // Actualizamos el estado con los datos modificados
    setEditedData(updatedData);
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {(type === "adminUsers" &&
            `Editando usuario: ${formData.nombreUsuario}`) ||
            (type === "adminProducts" &&
              `Editando Producto: ${formData.nombre}`) ||
            "Modal Title"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {type === "adminUsers" && (
          <UserFormModal
            handleChange={handleChange}
            editedData={editedData}
            handleEnabledData={handleEnabledData}
            errors={errors}
          />
        )}

        {type === "adminProducts" && (
          <ProductsFormModal
            handleChange={handleChange}
            editedData={editedData}
            errores={errors}
          />
        )}

        {type === "adminAnimals" && (
          <AnimalsFormModal
            handleChange={handleChange}
            editedData={editedData}
          />
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        {(type === "adminUsers" || type === "adminProducts" || type === "adminAnimals") && !isNew
          ? (
            <Button onClick={handleSaveChanges} disabled={isLoading}>
              {isLoading ? "Guardando..." : "Guardar cambios"}
            </Button>
          )
          : (type === "adminProducts" || type === "adminAnimals") && isNew
          && (
            <Button onClick={handleCreate} disabled={isLoading}>
              {isLoading ? "Creando..." : "Crear"}
            </Button>
          )}
      </Modal.Footer>
    </Modal>
  );
};

export default BasicModal;
