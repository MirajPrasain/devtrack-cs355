const express  = require('express');
const router   = express.Router();
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const db       = require('../db/index');

const SECRET_KEY = process.env.JWT_SECRET;

// REGISTER
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).send("Username and password required");

  // check if username already taken
  const existing = await db.users.findOne({ username });
  if (existing) return res.status(409).send("Username already taken");

  // hash password then store
  const hashed = await bcrypt.hash(password, 10);
  await db.users.insert({ username, password: hashed });

  res.send({ status: "registered" });
});

// LOGIN
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await db.users.findOne({ username });
  if (!user) return res.status(401).send("Invalid credentials");

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).send("Invalid credentials");

  const token = jwt.sign(
    { username },
    SECRET_KEY,
    { expiresIn: '1h' }
  );

  res.send({ auth: token });
});

module.exports = router;