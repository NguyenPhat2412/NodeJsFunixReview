import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddUser = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  // ham xy ly submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    await axios.post("http://localhost:5000/add-user", { name }); // post data to server
    setName("");
    navigate("/users"); // chuyen navigate sang users
  };

  return (
    <div>
      <nav>
        <ul className="flex gap-4">
          <li>
            <a href="/">Enter User</a>
          </li>
          <li>
            <a href="/users">Users</a>
          </li>
        </ul>
      </nav>
      <form className="flex flex-row gap-4 mt-4" onSubmit={handleSubmit}>
        <label>
          <input
            type="text"
            name="name"
            className="border p-2 "
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <button
          type="submit"
          className="border p-2 bg-blue-500 text-white cursor-pointer"
        >
          Add User
        </button>
      </form>
    </div>
  );
};
export default AddUser;
