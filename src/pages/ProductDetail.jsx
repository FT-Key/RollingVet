import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getOneProduct } from "../helpers/ServerProducts";
import "../css/ProductDetail.css";
import {
  addToCart,
  addToFav,
  removeFromCart,
  removeFromFavs,
} from "../helpers/ServerUsers";
import { useAuth } from '../context/AuthContext';
import Loading from "../components/Loading";
import { Col, Container, Row } from "react-bootstrap";
import Zoom from '../components/Zoom'; // Importa el componente Zoom
import { RedirectToLogin } from "../helpers/Redirects";
import { Helmet } from 'react-helmet-async';

const ProductDetail = () => {
  const { productId } = useParams();
  const [producto, setProducto] = useState(null);
  const [cart, setCart] = useState([]); // Nuevo estado para el carrito
  const [favorites, setFavorites] = useState([]); // Nuevo estado para los favoritos
  const { user, carrito, favoritos, setUpdateMark, setBooleanUpdateMark } = useAuth();
  const navigate = useNavigate();

  const BUTTON_CART_TEXT = (inCart) =>
    inCart ? "Quitar de carrito" : "Agregar a carrito";
  const BUTTON_FAVS_TEXT = (inFavs) =>
    inFavs ? "Quitar de favoritos" : "Agregar a favoritos";

  useEffect(() => {
    const listaCarrito = carrito.map((prod) => prod._id);
    const listaFavoritos = favoritos.map((prod) => prod._id);
    setCart(listaCarrito);
    setFavorites(listaFavoritos);
  }, [carrito, favoritos]);

  useEffect(() => {
    const fetchProduct = async () => {
      const data = await getOneProduct(productId);
      setProducto(data);
    };
    fetchProduct();
  }, [productId]);

  const handleButtonCart = async () => {

    redirection();

    if (!cart.includes(productId)) {
      const addToCartFunction = async () => {
        await addToCart(productId);
        setUpdateMark("cart");
        setBooleanUpdateMark((prevMark) => !prevMark);
      };
      addToCartFunction();
    } else {
      const removeFromCartFunction = async () => {
        await removeFromCart(productId);
        setUpdateMark("cart");
        setBooleanUpdateMark((prevMark) => !prevMark);
      };
      removeFromCartFunction();
    }
  };

  const handleButtonFav = async () => {

    redirection();

    if (!favorites.includes(productId)) {
      const addToFavFunction = async () => {
        await addToFav(productId);
        setUpdateMark("fav");
        setBooleanUpdateMark((prevMark) => !prevMark);
      };
      addToFavFunction();
    } else {
      const removeFromFavsFunction = async () => {
        await removeFromFavs(productId);
        setUpdateMark("fav");
        setBooleanUpdateMark((prevMark) => !prevMark);
      };
      removeFromFavsFunction();
    }
  };

  const redirection = () => {
    if (!user) {
      RedirectToLogin({ navigate });
    }
  }

  if (!producto) {
    return <Loading />;
  }

  return (
    <>
      <Helmet>
        <title>Detalle del producto</title>
      </Helmet>
      <div className="product-detail">
        <Container fluid>
          <Row>

            <Col xs={12}>
              <h1>{producto.nombre}</h1>
            </Col>

            <Col xs={12} md={6}>
              {/* Envuelve la imagen dentro del componente Zoom */}
              <Zoom imageUrl={producto.imagenUrl}>
              </Zoom>
            </Col>

            <Col xs={12} md={6}>
              <p>
                <strong>Descripción:</strong> {producto.descripcion}
              </p>
              <p>
                <strong>Categoría:</strong> {producto.categoria}
              </p>
              <p>
                <strong>codigo de barras:</strong> {producto.codigoDeBarras}
              </p>
              <p>
                <strong>Proveedor:</strong> {producto.proveedor}
              </p>
              <p className="product-price">${producto.precio}</p>
              <p>
                <strong>Stock:</strong> {producto.cantidadEnStock}
              </p>
              <p>
                <strong>Calificaciones:</strong> {producto.calificaciones}/5
              </p>
              <p>
                <strong>Garantía:</strong> {producto.garantia}
              </p>
              <p>
                <strong>Fecha de publicación:</strong>{" "}
                {new Date(producto.fechaDeIngreso).toLocaleDateString()}
              </p>
              {producto.descuento && (
                <p>
                  <strong>Descuento:</strong> {producto.descuento}
                </p>
              )}

              <div className="product-buttons">
                <button className={"btn btn-success"} onClick={handleButtonCart}>
                  {BUTTON_CART_TEXT(cart.includes(productId))}
                </button>
                <button className={"btn btn-warning"} onClick={handleButtonFav}>
                  {BUTTON_FAVS_TEXT(favorites.includes(productId))}
                </button>
              </div>
            </Col>

          </Row>
        </Container>

      </div>
    </>
  );
};

export default ProductDetail;