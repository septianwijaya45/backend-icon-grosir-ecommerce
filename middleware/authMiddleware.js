const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token not found" });

  jwt.verify(token, "accesssecret", (err, user) => {
    console.log(err)
    if (err) return res.status(403).json({ 
      statusCode: 403,
      error: "Invalid token" 
    });
    req.user = user
    next();
  });
}

module.exports = {
  authenticateToken,
};
