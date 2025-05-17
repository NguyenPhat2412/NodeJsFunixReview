import { Link, useNavigate } from "react-router-dom";
import "./NavBar.css";
import { useState } from "react";
const NavBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    fetch("http://localhost:8080/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Đăng xuất không thành công");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Đăng xuất thành công:", data);
        setIsLoggedIn(false);
      })
      .catch((error) => {
        console.error("Lỗi:", error);
      });
    alert("Đăng xuất thành công");
    navigate("/");
  };
  return (
    <>
      <nav className="navbar flex justify-between items-center bg-purple-800 p-4">
        <div className="logo font-bold text-white text-2xl cursor-pointer">
          <Link to="/">MessageNode</Link>
        </div>
        <div>
          <ul className="flex space-x-4 text-white flex-direction: row">
            <li>
              <Link to="/">Home</Link>
            </li>
            {isLoggedIn ? (
              <ul>
                <p>name</p>
                <button onClick={handleLogout}>Logout</button>
              </ul>
            ) : (
              <>
                <li>
                  <Link to="/login">Login</Link>
                </li>
                <li>
                  <Link to="/register">Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
