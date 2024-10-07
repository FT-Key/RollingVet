import React, { useState, useEffect, useMemo } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/Comentarios.css';
import { deleteServerData, fetchServerData, postServerData } from '../helpers/ServerCalling';
import { getToken } from '../helpers/Token.helper';
import { useAuth } from '../context/AuthContext';
import SVG from '../components/SVG';
import PaginationComponent from '../components/PaginationComponent.jsx';
import { validateCommentsFields } from '../components/Validators.jsx';

const Comentarios = () => {
  const { user } = useAuth();
  const [comentarios, setComentarios] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [calificacion, setCalificacion] = useState(0);
  const [updateMark, setUpdateMark] = useState(false);
  const [errors, setErrors] = useState({});

  // PAGINACION
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchComentarios = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await fetchServerData(apiUrl, `/comentarios`);
        setComentarios(response.comentarios);
        setTotalPages(Math.ceil(response.comentarios.length / limit));
      } catch (error) {
        console.error("Error al obtener comentarios:", error);
      }
    };

    fetchComentarios();
  }, [limit, updateMark]);

  const agregarComentario = async () => {
    const nuevoComentarioObj = {
      texto: nuevoComentario,
      calificacion,
    };

    const validationErrors = validateCommentsFields(nuevoComentarioObj);

    if (validationErrors && Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      await postServerData(apiUrl, `/comentarios`, nuevoComentarioObj);
      setNuevoComentario('');
      setCalificacion(0);
      setModalShow(false);
      setUpdateMark(prev => !prev);
      setErrors({}); // Limpiar errores al agregar comentario exitosamente
    } catch (error) {
      console.error("Error al agregar comentario:", error);
    }
  };

  const handleDelete = async (idComentario) => {
    if (user) {
      if (user.rol === "admin") {
        try {
          const apiUrl = import.meta.env.VITE_API_URL;
          const token = getToken();
          await deleteServerData(apiUrl, `/comentarios/${idComentario}`, token);
          setUpdateMark(prev => !prev);
        } catch (error) {
          console.error("Error al eliminar comentario:", error);
        }
      } else {
        console.log("No posee permisos suficientes para borrar comentarios");
      }
    } else {
      console.log("Debe registrarse para borrar comentarios");
    }
  };

  const comentariosActuales = comentarios.slice((currentPage - 1) * limit, currentPage * limit);

  const fillEmptySpaces = useMemo(() => {
    const spacesToFill = limit - comentariosActuales.length;
    return Array(spacesToFill).fill(null);
  }, [comentariosActuales.length, limit]);

  return (
    <div className='comentariosPage'>
      <h2>Comentarios de Clientes</h2>

      <div className='mb-3 mx-3'>
        <Button variant="primary" onClick={() => setModalShow(true)}>
          Calificar
        </Button>
      </div>

      <div className='mx-3'>
        <ul className="list-unstyled">
          {comentariosActuales.map((comentario) => (
            <li key={comentario._id} className='d-flex justify-content-between align-items-center'>
              <p className='d-flex align-items-center'>
                {/* Estrellas llenas */}
                {Array.from({ length: comentario.calificacion }, (_, index) => (
                  <SVG
                    name={'star'}
                    width="24px"
                    height="24px"
                    color={'gold'}
                    key={`${comentario._id + index}`}
                  />
                ))}
                {/* Estrellas vacías */}
                {Array.from({ length: 5 - comentario.calificacion }, (_, index) => (
                  <SVG
                    name={'star'}
                    width="24px"
                    height="24px"
                    color={'transparent'}
                    key={`${comentario._id + index}`}
                  />
                ))}
                - {comentario.texto}
              </p>
              {user && user.rol === "admin" && (
                <Button variant="danger" onClick={() => handleDelete(comentario._id)} className="btn-delete me-3">
                  x
                </Button>
              )}
            </li>
          ))}

          {fillEmptySpaces.map((_, index) => (
            <li key={`empty-${index}`} className='d-flex justify-content-between align-items-center comentarioVacio'>
              <p className='d-flex align-items-center'>
                {/* Estrellas vacías */}
                {Array.from({ length: 5 }, (_, starIndex) => (
                  <SVG
                    name={'star'}
                    width="24px"
                    height="24px"
                    color={'transparent'}
                    key={`empty-star-${index}-${starIndex}`}
                  />
                ))}
                - Sin comentario
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* Componente de paginación */}
      {totalPages > 1 && (
        <PaginationComponent
          totalPages={totalPages}
          currentPage={currentPage}
          setPage={setCurrentPage}
        />
      )}

      <Modal show={modalShow} onHide={() => setModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Deja tu Comentario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formComentario">
              <Form.Label>Comentario</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={nuevoComentario}
                onChange={(e) => setNuevoComentario(e.target.value)}
                placeholder="Escribe tu comentario"
                isInvalid={!!errors.texto} // Muestra el borde rojo si hay error
              />
              <Form.Control.Feedback type="invalid">{errors.texto}</Form.Control.Feedback> {/* Mensaje de error */}
            </Form.Group>
            <Form.Group controlId="formCalificacion">
              <Form.Label>Calificación</Form.Label>
              <Form.Control
                as="select"
                value={calificacion}
                onChange={(e) => setCalificacion(Number(e.target.value))}
                isInvalid={!!errors.calificacion} // Muestra el borde rojo si hay error
              >
                {[0, 1, 2, 3, 4, 5].map((estrella) => (
                  <option key={estrella} value={estrella}>
                    {estrella}
                  </option>
                ))}
              </Form.Control>
              <Form.Control.Feedback type="invalid">{errors.calificacion}</Form.Control.Feedback> {/* Mensaje de error */}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalShow(false)}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={agregarComentario}>
            Enviar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Comentarios;