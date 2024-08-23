import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useState, useEffect } from "react";
import "../css/BasicModal.css";
import { putServerData } from "../helpers/ServerCalling";
import UserFormModal from "./UserFormModal";
import ProductsFormModal from "./ProductsFormModal";
import { validateProductFields, validateUserFields } from "./Validators";
import { uploadProductImage } from "../helpers/ServerProducts";
import { uploadProfileImage } from "../helpers/ServerUsers";

const BasicModal = ({
  type,
  show,
  onHide,
  userData,
  functionUpdateData,
  productData,
}) => {
  const [formData, setFormData] = useState(
    (type === "adminUsers" && userData) ||
    (type === "adminProducts" && productData)
  );
  const [editedData, setEditedData] = useState(formData);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Restablecer editedData cuando se cierra el modal
    if (!show) {
      setEditedData(formData);
    }
  }, [show, formData]);

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
    const { name, value, type: inputType, checked, files } = e.target;
    const updatedData = { ...editedData };

    if (inputType === "file") {
      // Solo almacenar el archivo en una variable temporal, sin modificar el editedData
      console.log("FILES: ", files)
      console.log("NAME: ", name)
      if (files && files.length > 0) {

        // Crear un enlace temporal para mostrar la imagen
        const fileUrl = URL.createObjectURL(files[0]);

        updatedData["uploadedFile"] = files[0]; // Guardar temporalmente el archivo
        updatedData[name] = fileUrl;
        console.log("UPDATED DATA: ", updatedData)
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
      updatedData[name] = inputType === "checkbox" ? checked : value;
    }

    setEditedData(updatedData);
  };

  const handleSaveChanges = async () => {
    let validationErrors;

    switch (true) {
      case type === "adminUsers":
        if (typeof editedData.fotoPerfil === "string" && editedData.fotoPerfil.startsWith("blob:")) {
          // Elimina el campo fotoPerfil si comienza con 'blob:'
          delete editedData.fotoPerfil;
        }
        break;

      case type === "adminProducts":
        if (typeof editedData.imageUrl === "string" && editedData.imageUrl.startsWith("blob:")) {
          // Elimina el campo imageUrl si comienza con 'blob:'
          delete editedData.imageUrl;
        }
        break;

      default:
        break;
    }
    console.log("DATOS DEL PRODUCTO: ", editedData)

    switch (true) {
      case type === "adminUsers":
        validationErrors = validateUserFields(editedData);
        break;

      case type === "adminProducts":
        validationErrors = validateProductFields(editedData);
        break;

      default:
        break;
    }

    console.log("ValidationErrors.Length: ", Object.keys(validationErrors).length)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      console.log("Errores: ", validationErrors);
      return;
    }

    try {
      const { uploadedFile, ...productDataWithoutFile } = editedData;

      // Hacer la petición PUT para actualizar el producto, excluyendo el archivo
      let updatedData;
      switch (true) {
        case type === "adminUsers":
          updatedData = await putServerData(
            "http://localhost:3001",
            `/usuarios/${editedData._id}`,
            productDataWithoutFile
          );
          break;

        case type === "adminProducts":
          updatedData = await putServerData(
            "http://localhost:3001",
            `/productos/${editedData._id}`,
            productDataWithoutFile
          );
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

          default:
            break;
        }

        if (!uploadResponse) {
          throw new Error(uploadResponse.message);
        }

        console.log("Archivo subido:", uploadResponse.message, uploadResponse.data);
      }

      setFormData(editedData);
      functionUpdateData((prevMark) => !prevMark);
      console.log("Producto guardado:", updatedData);
      onHide(); // Cerrar el modal
    } catch (error) {
      console.error("Error al guardar el producto:", error);
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
              `Editando Producto: ${formData.name}`) ||
            "Modal Title"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {type === "adminUsers" && (
          <UserFormModal handleChange={handleChange} editedData={editedData} handleEnabledData={handleEnabledData} />
        )}

        {type === "adminProducts" && (
          <ProductsFormModal
            handleChange={handleChange}
            editedData={editedData}
          />
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        {(type === "adminUsers" || type === "adminProducts") && (
          <Button onClick={handleSaveChanges}>Guardar cambios</Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default BasicModal;
