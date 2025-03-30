const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

let users = []; // Temporary in-memory "database"

// **SIGNUP ENDPOINT**
app.post("/api/v1/users/signup", async (req, res) => {
  const { firstName, lastName, email, username, password, country } = req.body;

  if (!firstName || !lastName || !email || !username || !password || !country) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (users.some((user) => user.email === email || user.username === username)) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = { id: users.length + 1, firstName, lastName, email, username, password: hashedPassword, country };
  users.push(newUser);

  res.status(201).json({ message: "User registered successfully", user: newUser });
});

// **LOGIN ENDPOINT**
app.post("/api/v1/users/login", async (req, res) => {
  const { emailOrUsername, password } = req.body;

  if (!emailOrUsername || !password) {
    return res.status(400).json({ message: "Email/Username and password are required" });
  }

  const user = users.find((user) => user.email === emailOrUsername || user.username === emailOrUsername);

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.json({ message: "Login successful", user });
});

// **TEST SERVER**
app.get("/", (req, res) => {
  res.send("Server is running...");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
