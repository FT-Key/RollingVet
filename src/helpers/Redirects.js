export const RedirectToLogin = ({ navigate }) => {
  savePreviousRoute();
  navigate('/inicioSesion');
};

export const RedirectToRegister = ({ navigate }) => {
  savePreviousRoute();
  navigate('/inicioSesion');
};

const savePreviousRoute = () => {
  const currentLocation = window.location.pathname;
  sessionStorage.setItem('previousRoute', currentLocation);
};

export const redirectAfterLogin = (navigate) => {
  const previousRoute = sessionStorage.getItem('previousRoute') || '/';
  sessionStorage.removeItem('previousRoute'); // Opcional: Limpiar después de usarlo
  navigate(previousRoute);
};