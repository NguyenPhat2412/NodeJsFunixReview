import { Link } from "react-router-dom";
import "../public/main.css";
const Header = () => {
  return (
    <main className="main-header">
      <nav className="main-header__nav">
        <ul className="main-header__item-list">
          <li className="main-header__item">
            <Link to="/">Shop</Link>
          </li>
          <li className="main-header__item">
            <Link to="/products">Products</Link>
          </li>
          <li className="main-header__item">
            <Link to="/cart">Cart</Link>
          </li>
          <li className="main-header__item">
            <Link to="/orders">Orders</Link>
          </li>
          <li className="main-header__item">
            <Link to="/add-product">Add Product</Link>
          </li>
          <li className="main-header__item">
            <Link to="/admin-product">Admin Product</Link>
          </li>
        </ul>
      </nav>
    </main>
  );
};
export default Header;
