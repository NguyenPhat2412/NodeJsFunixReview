import "./Register.css";
import NavBar from "../../components/NavBar/NavBar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Hàm xử lý khi người dùng nhấn nút "Register"
  const handleRegister = (e) => {
    e.preventDefault();

    // kiểm tra xem mật khẩu và xác nhận mật khẩu có giống nhau không
    if (password !== confirmPassword) {
      setError("Mật khẩu không khớp");
      return;
    }

    //Validate dữ liệu đầu vào
    if (!username || !email || !password || !confirmPassword) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    // Gửi yêu cầu đăng ký đến server
    fetch("http://localhost:8080/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password,
        confirmPassword,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Đăng ký không thành công");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Đăng ký thành công:", data);
        alert("Đăng ký thành công, chuyển hướng đến trang đăng nhập...");

        // Chuyển hướng đến trang đăng nhập hoặc trang khác
        navigate("/login");
      })
      .catch((error) => {
        console.error("Lỗi:", error);
        setError(error.message);
      });
  };

  return (
    <>
      <NavBar />
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <h1 className="text-4xl font-bold mb-4">Register</h1>
        <form className="bg-white p-6 rounded shadow-md w-80">
          {error && (
            <div className="mb-4">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              type="text"
              placeholder="Username"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="confirm-password"
            >
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full cursor-pointer"
            onClick={handleRegister}
          >
            Register
          </button>
        </form>
      </div>
    </>
  );
};

export default Register;
