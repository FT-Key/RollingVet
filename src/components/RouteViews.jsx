import { Route, Routes } from "react-router-dom";
import NavigationBar from "./NavigationBar";
import Footer from "./Footer";
import NotFound from "../pages/NotFound";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AdminUsers from "../pages/AdminUsers";
import AdminProducts from "../pages/AdminProducts";
import ProductDetail from "../pages/ProductDetail";
import Favoritos from "../pages/Favoritos";
import Carrito from "../pages/Carrito";
import ProtectedRoute from "../components/ProtectedRoute";
import SobreMi from "../pages/SobreMi";
import Contacto from "../pages/Contacto";
import PagosResult from "../pages/PagosResult";
import AppointmentRequest from "../pages/AppointmentRequest";
import AppointmentList from "../pages/AppointmentsList";
import AdminAppointments from "../pages/AdminAppointments";
import AdminAnimals from "../pages/AdminAnimals";
import Planes from "../pages/Planes";
import AnimalsList from "../pages/AnimalList";
import AnimalDetail from "../pages/AnimalDetail";

const RouteViews = () => {
  return (
    <>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/inicioSesion" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/sobreMi" element={<SobreMi />} />
        <Route path="/contacto" element={<Contacto />} />

        {/* Rutas protegidas para roles específicos */}
        <Route
          path="/adminUsers"
          element={
            <ProtectedRoute requiredRole={['admin']}>
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/adminProducts"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminProducts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/adminAppointments"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminAppointments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/adminAnimals"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminAnimals />
            </ProtectedRoute>
          }
        />

        {/* Rutas protegidas solo para usuarios autenticados */}
        <Route
          path="/favoritos"
          element={
            <ProtectedRoute requiredRole={['cliente', 'admin']}>
              <Favoritos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/carrito"
          element={
            <ProtectedRoute requiredRole={['cliente', 'admin']}>
              <Carrito />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pagos/result/:result"
          element={
            <ProtectedRoute requiredRole={['cliente', 'admin']}>
              <PagosResult />
            </ProtectedRoute>
          }
        />
        <Route
          path="/animalDetail/:animalId"
          element={
            <ProtectedRoute requiredRole={['cliente', 'admin']}>
              <AnimalDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/misMascotas"
          element={
            <ProtectedRoute requiredRole={['cliente', 'admin']}>
              <AnimalsList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/planes"
          element={
            <ProtectedRoute requiredRole={['cliente', 'admin']}>
              <Planes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/turnos"
          element={
            <ProtectedRoute requiredRole={['cliente', 'admin']}>
              <AppointmentRequest />
            </ProtectedRoute>
          }
        />
        <Route
          path="/turnos/lista"
          element={
            <ProtectedRoute requiredRole={['cliente', 'admin']}>
              <AppointmentList />
            </ProtectedRoute>
          }
        />

        <Route path="/productDetail/:productId" element={<ProductDetail />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
};

export default RouteViews;