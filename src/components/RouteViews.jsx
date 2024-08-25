import { Route, Routes } from "react-router-dom";
import NavigationBar from "./NavigationBar";
import Footer from "./Footer";
import NotFound from "../pages/NotFound";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AdminUsers from "../pages/AdminUsers";
import ServerResponse from "../pages/ServerResponse";
import Servers from "../pages/Servers";
import AdminProducts from "../pages/AdminProducts";
import ProductDetail from "../pages/ProductDetail";
import Favoritos from "../pages/Favoritos";
import Carrito from "../pages/Carrito";
import ProtectedRoute from "../components/ProtectedRoute";
import SobreMi from "../pages/SobreMi";
import Contacto from "../pages/Contacto";

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
        <Route path="/servers" element={<Servers />} />

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
        <Route path="/productDetail/:productId" element={<ProductDetail />} />
        <Route path="/serverResponse" element={<ServerResponse />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
};

export default RouteViews;