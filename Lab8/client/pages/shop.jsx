import { useEffect, useState } from "react";
import "../public/product.css";
import axios from "axios";
const Shop = () => {
  const [products, setProducts] = useState([]);
  // const [cart, setCart] = useState([]);

  // lay du lieu tu axios setUsers
  useEffect(() => {
    axios
      .get("http://localhost:5000/products")
      .then((res) => {
        setProducts(res.data);
        console.log(setProducts);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  // lấy dữ liệu về để add vào cart
  const addToCart = (product) => {
    axios
      .post("http://localhost:5000/cart", product)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <main>
      <div className="grid">
        {products.map((product, index) => (
          <article key={index} className="card product-item">
            <header className="card__header">
              <h1 className="product__title">{product.title}</h1>
            </header>
            <div className="card__image">
              <img src={product.image} alt="A Book" />
            </div>
            <div className="card__content">
              <h2 className="product__price">{product.price}</h2>
              <p className="product__description">{product.description}</p>
            </div>
            <div className="card__actions">
              <button className="btn">View Details</button>
              <button className="btn" onClick={() => addToCart(product)}>
                Add to Cart
              </button>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
};

export default Shop;
