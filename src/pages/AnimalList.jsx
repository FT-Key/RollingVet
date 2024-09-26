import React, { useEffect, useState } from 'react';
import { getAnimals, deleteAnimal, createAnimal, uploadAnimalImage } from '../helpers/ServerAnimals.js'; // Asegúrate de importar createAnimal
import BasicCard from '../components/BasicCard.jsx';
import { Col, Container, Row, Form, Button } from 'react-bootstrap';
import PaginationComponent from '../components/PaginationComponent.jsx';
import { Helmet } from 'react-helmet-async';
import { useAuth } from "../context/AuthContext";

const AnimalsList = () => {
  const { user } = useAuth();
  const [animales, setAnimales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(3);
  const [totalPages, setTotalPages] = useState(1);
  const [updateMark, setUpdateMark] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false); // Nuevo estado para controlar si el formulario está siendo enviado

  const [formData, setFormData] = useState({
    nombre: '',
    tipo: '',
    edad: '',
    raza: '',
    descripcion: '',
    imagen: null,
    fotoUrl: '',
    esterilizado: false, // Iniciar como falso
    vacunas: [], // Iniciar como un array vacío
    peso: '',
    genero: '',
  });

  const [imagePreview, setImagePreview] = useState(null); // Estado para la vista previa de la imagen
  const [useUrl, setUseUrl] = useState(false); // Estado para elegir entre subir imagen o usar URL

  useEffect(() => {
    const fetchAnimals = async () => {
      setLoading(true);
      try {
        const result = await getAnimals(page, limit, { duenio: user._id, estado: "Mascota" });
        setAnimales(result.animales);
        if (result.pagination) {
          setTotalPages(
            Math.ceil(
              result.pagination.totalAnimales / (result.pagination.limit || result.pagination.totalAnimales)
            )
          );
        } else {
          setTotalPages(1);
        }
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los animales');
        setLoading(false);
      }
    };

    fetchAnimals();
  }, [page, limit, updateMark]);

  const deletePet = async (animalId) => {
    try {
      await deleteAnimal(animalId);
      setUpdateMark(prev => !prev);
    } catch (error) {
      console.error("Error al eliminar el animal:", error);
      setError('Error al eliminar el animal');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));

    // Manejar la selección de archivo para la imagen
    if (name === "imagen" && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImagePreview(URL.createObjectURL(file)); // Crear una URL para la vista previa
      setFormData(prevData => ({
        ...prevData,
        imagen: file, // Guardar el archivo en el estado
      }));
    }
  };

  // Cuando cambias a usar la URL
  const handleToggleUrl = () => {
    setUseUrl(prev => !prev);
    setFormData(prevData => ({
      ...prevData,
      imagen: null, // Limpiar la imagen al cambiar a URL
      fotoUrl: prevData.fotoUrl || '', // Asegúrate de que fotoUrl sea una cadena vacía
    }));
    setImagePreview(null); // Limpiar la vista previa al cambiar a URL
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Desactivar el botón y cambiar el texto a "Generando..."

    try {
      const newAnimal = { ...formData, duenio: user._id, estado: "Mascota" };

      // Enviar el objeto directamente sin FormData()
      const response = await createAnimal(newAnimal); // Asegúrate de tener esta función en tu helper
      const newPetId = response.animal._id;

      // Verifica si hay una imagen que subir
      if (formData.imagen) {
        const fileData = new FormData();
        fileData.append("image", formData.imagen);  // Importante que sea 'image'

        const uploadResult = await uploadAnimalImage(newPetId, fileData);
        if (!uploadResult.success) {
          console.error("Error al subir la imagen:", uploadResult.message);
          setError(uploadResult.message);
        }
      }

      // Resetear el formulario
      setFormData({
        nombre: '',
        tipo: '',
        edad: '',
        raza: '',
        descripcion: '',
        imagen: null,
        fotoUrl: '',
        esterilizado: false, // Iniciar como falso
        vacunas: [], // Iniciar como un array vacío
        peso: '',
        genero: '',
      });
      setImagePreview(null); // Resetear la vista previa de la imagen
      setUpdateMark(prev => !prev);
    } catch (error) {
      console.error("Error al crear el animal:", error);
      setError('Error al crear el animal');
    } finally {
      setIsSubmitting(false); // Rehabilitar el botón cuando termine el proceso
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <Helmet>
        <title>Mis Mascotas</title>
      </Helmet>

      <h2 className='text-center py-3'>Mis mascotas</h2>
      <Container>

        {animales.length > 0 ? (
          <>
            <Container className="animal-grid">
              <Row>
                {animales.map((animal) => (
                  <Col key={animal._id} sm={12} md={4}>
                    <BasicCard data={animal} type="animalCard" onDelete={deletePet} optionDeleteAnimal={true} />
                  </Col>
                ))}
              </Row>
            </Container>
            <PaginationComponent totalPages={totalPages} currentPage={page} setPage={setPage} />
          </>
        ) : (
          <h2 className='text-center py-5'>No tiene mascota registradas</h2>
        )}

        <div className='d-flex flex-column justify-content-center align-items-center'>
          <Form onSubmit={handleSubmit} className="w-50 mb-4 d-flex flex-column gap-3">
            <h3 className='text-center'>Agregar Nueva Mascota</h3>
            <Form.Group controlId="formNombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formTipo">
              <Form.Label>Tipo</Form.Label>
              <Form.Control
                as="select"
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione...</option>
                <option value="Perro">Perro</option>
                <option value="Gato">Gato</option>
                <option value="Ave">Ave</option>
                <option value="Conejo">Conejo</option>
                <option value="Reptil">Reptil</option>
                <option value="Otro">Otro</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formEdad">
              <Form.Label>Edad (años)</Form.Label>
              <Form.Control
                type="number"
                name="edad"
                value={formData.edad}
                onChange={handleChange}
                min={"0.5"}
                step={"0.5"}
                required
              />
            </Form.Group>

            <Form.Group controlId="formRaza">
              <Form.Label>Raza</Form.Label>
              <Form.Control
                type="text"
                name="raza"
                value={formData.raza}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formDescripcion">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formEsterilizado">
              <Form.Check
                type="checkbox"
                label="¿Está esterilizado?"
                name="esterilizado"
                checked={formData.esterilizado}
                onChange={(e) => setFormData(prevData => ({
                  ...prevData,
                  esterilizado: e.target.checked,
                }))}
              />
            </Form.Group>

            <Form.Group controlId="formVacunas">
              <Form.Label>Vacunas</Form.Label>
              {["Rabia", "Parvovirus", "Distemper", "Hepatitis", "Leptospirosis", "Bordetella"].map(vacuna => (
                <Form.Check
                  key={vacuna}
                  type="checkbox"
                  label={vacuna}
                  name="vacunas"
                  checked={formData.vacunas.includes(vacuna)}
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    setFormData(prevData => ({
                      ...prevData,
                      vacunas: isChecked
                        ? [...prevData.vacunas, vacuna]
                        : prevData.vacunas.filter(v => v !== vacuna),
                    }));
                  }}
                />
              ))}
            </Form.Group>

            <Form.Group controlId="formPeso">
              <Form.Label>Peso (kg)</Form.Label>
              <Form.Control
                type="number"
                name="peso"
                value={formData.peso}
                onChange={handleChange}
                step="0.1" // Permite incrementar en 0.1
                min="0.1"  // No permite valores menores a 0.1
              />
            </Form.Group>

            <Form.Group controlId="formGenero">
              <Form.Label>Género</Form.Label>
              <Form.Control
                as="select"
                name="genero"
                value={formData.genero}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione...</option>
                <option value="Macho">Macho</option>
                <option value="Hembra">Hembra</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formImagenToggle">
              <Form.Check
                type="switch"
                id="custom-switch"
                label="Usar URL de imagen"
                checked={useUrl}
                onChange={handleToggleUrl}
              />
            </Form.Group>

            {useUrl ? (
              <Form.Group controlId="formfotoUrl">
                <Form.Label>URL de Imagen</Form.Label>
                <Form.Control
                  type="text"
                  name="fotoUrl"
                  value={formData.fotoUrl || ''} // Asegúrate de que siempre sea una cadena
                  onChange={handleChange}
                  placeholder="Ingrese la URL de la imagen"
                  required
                />
              </Form.Group>
            ) : (
              <Form.Group controlId="formImagen">
                <Form.Label>Subir Imagen</Form.Label>
                <Form.Control
                  type="file"
                  name="imagen"
                  accept="image/*"
                  onChange={handleChange}
                />
                {imagePreview && (
                  <img src={imagePreview} alt="Vista previa" style={{ maxWidth: '150px', marginTop: '10px' }} />
                )}
              </Form.Group>
            )}

            <Button
              variant="success"
              type="submit"
              disabled={isSubmitting} // Deshabilitar el botón durante el envío
            >
              {isSubmitting ? "Generando..." : "Agregar Mascota"} {/* Cambiar el texto */}
            </Button>
          </Form>
        </div>

      </Container>
    </>
  );
};

export default AnimalsList;