import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <>
      <nav>
        <div className="logo">
          <p>MessageNode</p>
        </div>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/register">Register</Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default NavBar;
