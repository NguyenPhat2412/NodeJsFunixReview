import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/Register";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Register />} />
        <Route path="/register" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
