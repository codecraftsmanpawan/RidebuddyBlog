const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];

  // Check if token is present
  if (!token) return res.status(403).send("Access denied");

  // Check if token has "Bearer " prefix
  const tokenWithoutBearer = token.startsWith("Bearer ")
    ? token.split(" ")[1]
    : token;

  try {
    // Verify the token
    const verified = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);
    req.user = verified; // You can optionally attach user data to the request
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.error("Token verification failed:", err.message);
    res.status(401).send("Invalid token");
  }
};
