import { Route, Routes } from "react-router-dom";
import Shop from "../pages/shop";
import AddProduct from "../pages/AddProduct";
import Header from "../components/Header";
import Cart from "../pages/Cart";
import Product from "../pages/Product";
import Order from "../pages/Order";
import AdminProduct from "../pages/AdminProduct";
const App = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Shop />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/orders" element={<Order />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/products" element={<Product />} />
        <Route path="/admin-product" element={<AdminProduct />} />
      </Routes>
    </>
  );
};
export default App;
