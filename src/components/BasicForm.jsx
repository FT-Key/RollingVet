import { useState, useEffect } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { postServerData } from '../helpers/ServerCalling';
import { useAuth } from '../context/AuthContext'; // Importa el contexto de autenticación
import { redirectAfterLogin } from '../helpers/Redirects';
import { validateRegisterFields } from './Validators';
import '../css/BasicForm.css';

function BasicForm({ type }) {

  const navigate = useNavigate();
  const { loginContext } = useAuth(); // Usar loginContext para manejar el login
  const [errors, setErrors] = useState({});

  // Estados
  const [formLogin, setFormLogin] = useState({
    userName: '',
    userPass: '',
    userRemember: false
  });
  const [formRegister, setFormRegister] = useState({
    userName: '',
    userEmail: '',
    userPass: '',
    userPassConf: ''
  });
  const [clearForm, setClearForm] = useState(false);
  //

  // useEffect para observar cambios en el tipo y limpiar los formularios
  useEffect(() => {
    setFormLogin({
      userName: '',
      userPass: '',
      userRemember: false
    });
    setFormRegister({
      userName: '',
      userEmail: '',
      userPass: '',
      userPassConf: ''
    });

    // Seteo el clearForm para limpiar los formularios al desmontar el componente
    return () => {
      setClearForm(true);
    };
  }, [clearForm]);

  // Funciones
  ////CHANGE

  const handleChangeRegister = (ev) => {
    if (type !== "registro") {
      return console.log("Error al cargar página de registro.");
    }

    setFormRegister({ ...formRegister, [ev.target.name]: ev.target.value });
  }

  const handleChangeLogin = (ev) => {
    if (type !== "inicioSesion") {
      return console.log("Error al cargar página de inicio de sesión.");
    }

    const { name, value, type: inputType, checked } = ev.target;
    setFormLogin({ ...formLogin, [name]: inputType === 'checkbox' ? checked : value });
  }

  ////CLICK
  const handleClickRegister = async (ev) => {
    ev.preventDefault();

    if (type !== "registro") {
      return console.log("Error al cargar página de registro.");
    }

    const validationErrors = validateRegisterFields(formRegister);

    if (validationErrors && Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (formRegister.userPass !== formRegister.userPassConf) {
      setErrors({ userPassConf: "Las contraseñas no coinciden" });
      return;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL;

      const serverResponse = await postServerData(apiUrl, '/register', formRegister);

      if (serverResponse.nuevoUsuario && serverResponse.token) {

        const { token: jwtToken } = serverResponse; // Desestructura el token del JSON

        loginContext(jwtToken);
        redirectAfterLogin(navigate);
        console.log("Registro exitoso")

      } else if (!serverResponse.nuevoUsuario) {
        throw new Error('Error en el servidor al registrarse');
      }
    } catch (error) {
      // Revisar si el error tiene un mensaje de error retornado por el servidor
      if (error instanceof Error && error.response) {
        // Si el servidor devuelve un mensaje personalizado, lo mostramos
        const serverMessage = error.response.data.msg || 'Error desconocido en el servidor';
        setErrors({ incorrectRegister: serverMessage });
        throw new Error(serverMessage);
      } else {
        // Lanzar un mensaje de error genérico si no hay mensaje en la respuesta
        throw new Error('Error en el servidor al registrarse');
      }
    }
  }

  const handleClickLogin = async (ev) => {
    ev.preventDefault();

    if (type !== "inicioSesion") {
      return console.log("Error al cargar página de inicio de sesión.");
    }

    try {

      const apiUrl = import.meta.env.VITE_API_URL;

      const serverResponse = await postServerData(apiUrl, '/login', formLogin);

      if (serverResponse.token) {
        const { token: jwtToken } = serverResponse; // Desestructura el token del JSON

        loginContext(jwtToken);
        redirectAfterLogin(navigate);
        console.log("Sesión iniciada con éxito")

      } else if (!serverResponse.token) {
        throw new Error('Error en el servidor al iniciar sesión');
      }
    } catch (error) {
      setErrors({ incorrectLogin: "Usuario o contraseña incorrecta" });
      throw new Error('Error en el servidor al iniciar sesión');
    }
  }

  // Constantes
  const TEXT_TYPE = {
    registro: "Registrarse",
    inicioSesion: "Iniciar Sesión"
  };

  const COLOR_TYPE = {
    registro: "success",
    inicioSesion: "primary"
  };

  const CHANGE_TYPE = {
    registro: handleChangeRegister,
    inicioSesion: handleChangeLogin,
  };

  const CLICK_TYPE = {
    registro: handleClickRegister,
    inicioSesion: handleClickLogin,
  };
  //

  return (
    <>
      <h2 className='pt-4 text-center'>{TEXT_TYPE[type]}</h2>

      <Form className='w-100 h-100 d-flex flex-column justify-content-center align-items-center pt-3 pb-2 register-login-form'>

        <Form.Group controlId="formUserName">
          <Form.Label>Nombre de usuario</Form.Label>
          <Form.Control
            name='userName'
            type="text"
            placeholder="Nombre de usuario"
            value={type === 'registro' ? formRegister.userName : formLogin.userName}
            onChange={CHANGE_TYPE[type]}
            isInvalid={!!errors.userName} // Agrega esto
            autoComplete="username"
          />
          <Form.Control.Feedback type="invalid">{errors.userName}</Form.Control.Feedback>
        </Form.Group>

        {type === "registro" &&
          <Form.Group controlId="formUserEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              name='userEmail'
              type="email"
              placeholder="Email"
              value={formRegister.userEmail}
              onChange={CHANGE_TYPE[type]}
              isInvalid={!!errors.userEmail} // Agrega esto
            />
            <Form.Control.Feedback type="invalid">{errors.userEmail}</Form.Control.Feedback>
          </Form.Group>
        }

        <Form.Group controlId="formPassword">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            name='userPass'
            type="password"
            placeholder="Contraseña"
            value={type === 'registro' ? formRegister.userPass : formLogin.userPass}
            onChange={CHANGE_TYPE[type]}
            isInvalid={!!errors.userPass} // Agrega esto
          />
          <Form.Control.Feedback type="invalid">{errors.userPass}</Form.Control.Feedback>
        </Form.Group>

        {errors && errors.incorrectLogin &&
          (
            <>
              <div className="text-danger">{errors.incorrectLogin}</div>
            </>
          )
        }

        {type === "registro" &&
          <Form.Group controlId="formPasswordRepeat">
            <Form.Label>Repetir Contraseña</Form.Label>
            <Form.Control
              name='userPassConf'
              type="password"
              placeholder="Repetir contraseña"
              value={formRegister.userPassConf}
              onChange={CHANGE_TYPE[type]}
              isInvalid={!!errors.userPassConf} // Agrega esto
            />
            <Form.Control.Feedback type="invalid">{errors.userPassConf}</Form.Control.Feedback>
          </Form.Group>
        }

        {errors && errors.incorrectRegister &&
          (
            <>
              <div className="text-danger">{errors.incorrectRegister}</div>
            </>
          )
        }

        {type === "inicioSesion" &&
          <>
            <Form.Group controlId="formRemember" className='pt-2'>
              <Form.Check
                name='userRemember'
                type="checkbox"
                label="Mantener sesión iniciada"
                checked={formLogin.userRemember}
                onChange={CHANGE_TYPE[type]}
              />
            </Form.Group>

            <Container className='d-flex justify-content-center align-items-center pt-2'>
              <Link to={'/recuperarContraseña'}>¿Olvidaste tu contraseña?</Link>
            </Container>
          </>
        }

        <Button variant={COLOR_TYPE[type]} type="submit" className='mt-3' onClick={CLICK_TYPE[type]}>
          {TEXT_TYPE[type]}
        </Button>
      </Form>
    </>
  );
}

export default BasicForm;
