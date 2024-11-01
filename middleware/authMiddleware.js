const jwt = require("jsonwebtoken");

const authenticateToken = async (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) return res.status(401).send({ error: "JWT token is missing" });

  try {
    const secret = process.env.TOKEN_SECRET;
    const user = await new Promise((resolve, reject) => {
      jwt.verify(token, secret, (err, decoded) => {
        if (err) reject(err);
        else resolve(decoded);
      });
    });

    req.user = user; // Optionally assign decoded user info to `req.user`
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(403).send({ error: "Invalid token" });
    }
    res.status(500).send({ error: error.message });
  }
};

module.exports = authenticateToken;
