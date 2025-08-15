const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

module.exports = function authenticateToken(req, res, next) {
  const auth = req.headers['authorization'];
  const token = auth && auth.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Missing token' });

  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) return res.status(403).json({ message: 'Invalid/expired token' });
    req.user = payload; // { id, username, role, base }
    next();
  });
};
