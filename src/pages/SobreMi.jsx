import React from 'react';
import '../css/SobreMi.css';
import { Helmet } from "react-helmet";

const SobreMi = () => {
  return (
    <>
      <Helmet>
        <title>Sobre mí</title>
      </Helmet>
      <section className="sobre-mi">
        <div className="sobre-mi-content">
          <img
            src="../../public/profile.png"
            alt="Foto de perfil"
            className="sobre-mi-imagen"
          />
          <div className="sobre-mi-texto">
            <h2>Sobre mí</h2>
            <p>
              ¡Hola! Soy un desarrollador apasionado por la tecnología y la programación. Me
              encanta aprender cosas nuevas, enfrentar retos y mejorar mis habilidades día a día.
            </p>
            <p>
              Disfruto trabajar en proyectos de frontend y backend, con un enfoque en la
              construcción de aplicaciones web eficientes y escalables. Además, soy una persona
              muy curiosa, siempre investigando sobre nuevas tendencias tecnológicas.
            </p>
            <p>
              En mi tiempo libre, disfruto de la lectura, colaborar en proyectos de código abierto,
              y compartir conocimiento con otros. Si te interesa saber más de mi trabajo, ¡no dudes
              en contactarme!
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default SobreMi;