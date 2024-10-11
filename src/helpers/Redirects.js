export const RedirectToLogin = ({ navigate }) => {
  savePreviousRoute();
  navigate('/inicioSesion');
};

export const RedirectToRegister = ({ navigate }) => {
  savePreviousRoute();
  navigate('/registro');
};

const savePreviousRoute = () => {
  const currentLocation = window.location.pathname;
  sessionStorage.setItem('previousRoute', currentLocation);
};

export const redirectAfterLogin = (navigate) => {
  const previousRoute = sessionStorage.getItem('previousRoute') || '/';
  sessionStorage.removeItem('previousRoute');
  navigate(previousRoute);
};