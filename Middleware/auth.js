// Middleware/auth.js
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

exports.auth = async (req, res, next) => {
  let { authorization } = req.headers;
  const cookieToken = req.cookies?.jwt;

  const token = authorization?.startsWith("Bearer ")
    ? authorization.split(" ")[1]
    : authorization || cookieToken;

  if (!token) {
    return res.status(401).json({
      message: "you must login first",
    });
  }

  try {
    let decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    req.role = decode.role;
    req.id = decode.id;
    next();
  } catch (error) {
    res.status(403).json({
      message: "invalid token",
      error: error.message,
    });
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.role)) {
      return res.status(403).json({
        message: "you are not authorized",
      });
    }
    next();
  };
};