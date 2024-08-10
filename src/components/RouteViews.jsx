import { Route, Routes } from 'react-router-dom';
import NavigationBar from './NavigationBar';
import Footer from './Footer';
import NotFound from '../pages/NotFound';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import AdminUsers from '../pages/AdminUsers';
import ServerResponse from '../pages/ServerResponse';
import Servers from '../pages/Servers';
import AdminProducts from '../pages/AdminProducts';

const RouteViews = () => {
  return (
    <>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/inicioSesion" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/servers" element={<Servers />} />
        <Route path="/adminUsers" element={<AdminUsers />} />
        <Route path="/adminProducts" element={<AdminProducts />} />
        <Route path="/serverResponse" element={<ServerResponse />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
};

export default RouteViews;