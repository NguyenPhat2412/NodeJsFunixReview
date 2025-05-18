import { BrowserRouter, Route, Routes } from "react-router-dom";
import socket from "../components/Socket/Socket";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import ViewPosts from "../components/NewPosts/ViewPosts";
import EditPost from "../components/NewPosts/EditPost";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    socket.connect();
    socket.on("connect", () => {
      console.log("Connected to socket server", socket.id);
    });
    // lắng nghe các event do server emit
    socket.on("newPost", (data) => {
      console.log("New post received:", data);
    });
    return () => {
      // Ngắt kết nối socket khi component unmount
      socket.disconnect();
      console.log("Disconnected from socket server");
    };
  });
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/post/:id" element={<ViewPosts />} />
          <Route path="/edit/:id" element={<EditPost />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
