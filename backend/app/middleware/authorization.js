const jwt = require("express-jwt");
const User = require("../models/user.model");
module.exports = authorize;

function authorize() {
  const secret = "fuhguidskjgbvh8que823uy8hfuir295r2rff1541f32103210f231f354";
  return [
    // authenticate JWT token and attach decoded token to request as req.user
    jwt({ secret, algorithms: ["HS256"] }),
    // attach full user record to request object
    async (req, res, next) => {
      // get user with id from token 'sub' (subject) property
      const user = await User.findById(req.user.sub);
      // check user still exists
      if (!user) return res.status(401).json({ message: "Unauthorized" });
      // authorization successful
      req.user = user.get();
      next();
    },
  ];
}
