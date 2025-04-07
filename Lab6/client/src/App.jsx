import { Route, Routes } from "react-router-dom";
import AddUser from "../pages/addUser";
import ListUsers from "../pages/listUsers";
const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<AddUser />} />
        <Route path="/users" element={<ListUsers />} />
      </Routes>
    </>
  );
};
export default App;
