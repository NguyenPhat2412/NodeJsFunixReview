const Register = () => {
  return (
    <div className="register">
      <div className="register__container">
        <h1>Register</h1>
        <form>
          <input type="text" placeholder="Username" required />
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
