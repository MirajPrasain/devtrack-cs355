const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET;

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).send("Access Denied");

  jwt.verify(token, SECRET_KEY, (err, decodedUser) => {
    if (err) return res.status(403).send("Invalid Token");
    req.user = decodedUser;
    next();
  });
};

module.exports = authenticateToken;