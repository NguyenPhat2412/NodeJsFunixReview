import { Link, useNavigate, useParams } from "react-router-dom";
import "./NavBar.css";
import { useEffect, useState } from "react";
const NavBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState(null);
  // const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  // xử lí trạng thái đăng nhập
  useEffect(() => {
    fetch("http://localhost:8080/auth/current-user", {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Không thể lấy thông tin người dùng");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Thông tin người dùng:", data.user.username);
        setIsLoggedIn(true);
        setUserName(data.user);
      })
      .catch((error) => {
        console.error("Lỗi:", error);
      });
  }, [id]);

  const handleLogout = () => {
    fetch("http://localhost:8080/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
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
              <ul className="flex space-x-4 flex-direction: row">
                <li>
                  <p>{userName.username}</p>
                </li>
                <li>
                  <button onClick={() => handleLogout()}>Logout</button>
                </li>
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
