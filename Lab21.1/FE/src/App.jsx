import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import ViewPosts from "../components/NewPosts/ViewPosts";
import EditPost from "../components/NewPosts/EditPost";

function App() {
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
