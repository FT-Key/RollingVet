import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useState, useEffect } from "react";
import "../css/BasicModal.css";
import { putServerData } from "../helpers/ServerCalling";
import UserFormModal from "./UserFormModal";
import ProductsFormModal from "./ProductsFormModal";
import { validateProductFields, validateUserFields } from "./Validators";

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

    if (name.includes("[")) {
      // Si el nombre incluye corchetes, es un campo dentro de un array
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
      // Si el nombre incluye punto, es un campo en un objeto anidado
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
        validationErrors = validateUserFields(editedData);
        break;

      case type === "adminProducts":
        validationErrors = validateProductFields(editedData);
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
            "http://localhost:3001",
            `/usuarios/${editedData._id}`,
            editedData
          );
          break;

        case type === "adminProducts":
          updatedData = await putServerData(
            "http://localhost:3001",
            `/productos/${editedData._id}`,
            editedData
          );
          break;

        default:
          break;
      }

      setFormData(editedData);
      functionUpdateData((prevMark) => !prevMark);
      console.log("Producto guardado:", updatedData);
      onHide(); // Cerrar el modal
    } catch (error) {
      console.error("Error al guardar el producto:", error);
    }
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
          <UserFormModal handleChange={handleChange} editedData={editedData} />
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
