import "/src/pages/Login.css";
import NavBar from "../../components/NavBar/NavBar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Hàm xử lý khi người dùng nhấn nút "Login"
  const handleLogin = (e) => {
    e.preventDefault();

    //Validate dữ liệu đầu vào
    if (!email || !password) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    // Gửi yêu cầu đăng ký đến server
    fetch("http://localhost:8080/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Đăng nhập không thành công");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Đăng nhập thành công:", data);

        alert("Đăng nhập thành công, chuyển hướng đến trang chính...");
        // Chuyển hướng đến trang đăng nhập hoặc trang khác
        navigate("/");
      })
      .catch((error) => {
        console.error("Lỗi:", error);
        setError(error.message);
      });
  };
  return (
    <>
      <NavBar />
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 ">
        <h1 className="text-4xl font-bold mb-4">Login</h1>
        <form className="bg-white p-6 rounded shadow-md w-80">
          {error && (
            <div>
              <p className="text-red-500 text-sm mb-4">{error}</p>
            </div>
          )}

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Email
            </label>
            <input
              type="text"
              id="username"
              placeholder="Enter your username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full cursor-pointer"
            onClick={handleLogin}
          >
            Login
          </button>
        </form>
      </div>
    </>
  );
};

export default Login;
