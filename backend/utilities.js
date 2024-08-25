const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization; // Fixed method call
  const token = authHeader && authHeader.split(" ")[1];
  
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => { // Fixed callback parameters
    if (err) return res.sendStatus(403); // 403 Forbidden for invalid token
    req.user = user;
    next();
  });
}

module.exports = {
  authenticateToken,
};
