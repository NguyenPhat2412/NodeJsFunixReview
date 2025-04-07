const cors = require("cors");
const bodyParser = require("body-parser");
const express = require("express");

const app = express();
app.use(cors()); // cho phep request tu client
app.use(bodyParser.json());

const users = []; // du lieu tam thoi luu trong ram

// Route Get toan boo users
app.get("/users", (req, res) => {
  res.json(users);
});

// Route post them user
app.post("/add-user", (req, res) => {
  const { name } = req.body; // lay du lieu user name o ben reactjs
  if (name) {
    users.push(name); // them user voa mang user
    res.status(201).json({ message: "User added successfully" });
  } else {
    res.status(400).json({ message: "Name is required" });
  }
});

// Route chay o post 5000
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
