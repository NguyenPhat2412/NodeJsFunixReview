import axios from "axios";
import { useEffect, useState } from "react";

const ListUsers = () => {
  const [users, setUsers] = useState([]);

  // lay du lieu axios setUsers
  useEffect(() => {
    axios.get("http://localhost:5000/users").then((res) => {
      setUsers(res.data);
      console.log(res.data);
    });
  });

  return (
    <div>
      <h1>List Users</h1>
      <p>This is the list of users.</p>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <ul className="list-disc list-inside">
          {users.map((user, index) => (
            <li key={index} className="border p-2 mt-2 bg-gray-100">
              {user}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default ListUsers;
