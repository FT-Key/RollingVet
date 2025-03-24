import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BasicForm from '../components/BasicForm';
import GoogleAuth from '../components/GoogleAuth';
import { Container } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user]);

  return (
    <>
      <Helmet>
        <title>Iniciar Sesión</title>
      </Helmet>
      {user ?
        <h2 className='text-center m-5'>Ya se inició sesión</h2>
        :
        <>
          <BasicForm type={"inicioSesion"} />
          <p className='text-center'>o</p>
          <Container className='d-flex flex-column justify-content-center align-items-center pb-3 gap-2'>
            <GoogleAuth useParameter={'login'} />
          </Container>
        </>
      }
    </>
  );
};

export default Login;