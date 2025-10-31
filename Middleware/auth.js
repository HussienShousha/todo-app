const jwt = require("jsonwebtoken");
const { promisify } = require("util");

exports.auth = async (req, res, next) => {
  let { authorization } = req.headers;
     const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({
      message: "you must login first",
    });
  }

  try {
    // const token = authorization.startsWith("Bearer ")
    // //   ? authorization.split(" ")[1]
    //   : authorization;
    let decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    req.role = decode.role;
     req.id = decode.id;
    next();
  } catch (error) {
    res.status(403).json({
      message: "invaild token",
      error: error,
    });
  }
};

exports.restrictTo = (
  ...roles // ['user', 'admin] or ['admin']
) => {
  return (req, res, next) => {
    if (!roles.includes(req.role)) {
      return res.status(404).json({
        message: "you are not authorized",
      });
    } else {
      next();
    }
  };
};
