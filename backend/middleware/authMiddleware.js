const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header) {
      return res.status(401).json({ msg: "No token" });
    }

    const token = header.startsWith("Bearer ")
      ? header.split(" ")[1]
      : header;

    const decoded = jwt.verify(token, "secretkey");

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Invalid token" });
  }
};