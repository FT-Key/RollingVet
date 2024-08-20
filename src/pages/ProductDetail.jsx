import React from "react";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getOneProduct } from "../helpers/ServerProducts";
import "../css/ProductDetail.css";
import {
  addToCart,
  addToFav,
  getCart,
  getFavs,
  removeFromCart,
  removeFromFavs,
} from "../helpers/ServerUsers";

const ProductDetail = () => {
  const { productId } = useParams();
  const [producto, setProducto] = useState(null);
  const [updateMark, setUpdateMark] = useState();
  const [booleanUpdateMark, setBooleanUpdateMark] = useState(false);
  const [cart, setCart] = useState([]); // Nuevo estado para el carrito
  const [favorites, setFavorites] = useState([]); // Nuevo estado para los favoritos

  const BUTTON_CART_TEXT = (inCart) =>
    inCart ? "Quitar de carrito" : "Agregar a carrito";
  const BUTTON_FAVS_TEXT = (inFavs) =>
    inFavs ? "Quitar de favoritos" : "Agregar a favoritos";

  useEffect(() => {
    const fetchFavsAndCart = async () => {
      const cart = await getCart();
      const favs = await getFavs();
      const listaCarrito = cart.productos.map((prod) => prod._id);
      const listaFavoritos = favs.productos.map((prod) => prod._id);
      setCart(listaCarrito);
      setFavorites(listaFavoritos);
    };
    fetchFavsAndCart();
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      const data = await getOneProduct(productId);
      setProducto(data);
    };
    fetchProduct();
  }, [productId]);

  useEffect(() => {
    const fetchCartAndFavs = async () => {
      if (updateMark === "cart") {
        const nuevoCarrito = await getCart();
        const listaCarrito = nuevoCarrito.productos.map((prod) => prod._id);
        setCart(listaCarrito);
      } else if (updateMark === "fav") {
        const nuevosFavoritos = await getFavs();
        const listaFavoritos = nuevosFavoritos.productos.map(
          (prod) => prod._id
        );
        setFavorites(listaFavoritos);
      }
    };
    fetchCartAndFavs();
  }, [updateMark, booleanUpdateMark]);

  const handleButtonCart = async () => {
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

  if (!producto) {
    return <div>Loading...</div>;
  }

  return (
    <div className="product-detail">
      <h1>{producto.name}</h1>
      <img src={producto.imageUrl} alt={producto.name} />
      <p>
        <strong>Description:</strong> {producto.description}
      </p>
      <p>
        <strong>Category:</strong> {producto.category}
      </p>
      <p>
        <strong>Brand:</strong> {producto.brand}
      </p>
      <p>
        <strong>Model:</strong> {producto.model}
      </p>
      <p className="product-price">${producto.price}</p>
      <p>
        <strong>Stock:</strong> {producto.stock}
      </p>
      <p>
        <strong>Ratings:</strong> {producto.ratings}/5
      </p>
      <p>
        <strong>Warranty:</strong> {producto.warranty}
      </p>
      <p>
        <strong>Release Date:</strong>{" "}
        {new Date(producto.releaseDate).toLocaleDateString()}
      </p>
      {producto.discount && (
        <p>
          <strong>Discount:</strong> {producto.discount}
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
    </div>
  );
};

export default ProductDetail;
