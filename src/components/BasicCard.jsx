import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import "../css/BasicCard.css";

function BasicCard({ data, type, onDelete, optionDeleteAnimal = false }) {
  const handleDelete = async () => {
    // Muestra un cuadro de confirmación antes de eliminar
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este animal?");
    if (confirmDelete) {
      try {
        if (onDelete) {
          await onDelete(data._id); // Llama a la función onDelete para eliminar el animal
        }
      } catch (error) {
        console.error("Error al eliminar el animal:", error);
        // Aquí podrías mostrar un mensaje de error al usuario
      }
    }
  };

  return (
    <>
      {type === "productCard" && (
        <Card>
          <Card.Img variant="top" src={data.imagenUrl} />
          <Card.Body>
            <Card.Title>{data.nombre}</Card.Title>
            <Card.Text>{data.descripcion}</Card.Text>
            <div>
              <Button
                as={Link}
                to={`/productDetail/${data._id}`}
                variant="primary"
              >
                Ver más
              </Button>
            </div>
          </Card.Body>
        </Card>
      )}

      {type === "animalCard" && (
        <Card>
          <Card.Img variant="top" src={data.fotoUrl} alt="Sin foto" />
          <Card.Body>
            <Card.Title>{data.nombre}</Card.Title>
            <Card.Text>
              Tipo: {data.tipo ? data.tipo : "Desconocido"} <br />
              Raza: {data.raza ? data.raza : "Desconocida"} <br />
              Edad: {data.edad ? `${data.edad} años` : "No especificada"} <br />
              Dueño: {data.duenio?.nombre || "Sin dueño"}
            </Card.Text>
            <div className="d-flex justify-content-between">
              <Button
                as={Link}
                to={`/animalDetail/${data._id}`}
                variant="primary"
              >
                Ver detalles
              </Button>
              {optionDeleteAnimal &&
                (<Button
                  variant="danger" // Cambia el color del botón a rojo para eliminar
                  onClick={handleDelete}
                >
                  Eliminar
                </Button>)
              }
            </div>
          </Card.Body>
        </Card>
      )}
    </>
  );
}

export default BasicCard;