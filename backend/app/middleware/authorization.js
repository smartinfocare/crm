const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
module.exports = {
  validateToken: async (req, res, next) => {
    let cookie = req.cookies['jwt'];
    const authorizationHeaader = cookie;
    let result;
    if (authorizationHeaader) {
      const token = req.headers.authorization.split(" ")[1]; // Bearer <token>
      const options = {
        expiresIn: "2d",
      };
      try {
        // verify makes sure that the token hasn't expired and has been issued by us
        result = await jwt.verify(token, process.env.SECRET_KEY, options);
        // Let's pass back the decoded token to the request object
        if (result) {
          // We call next to pass execution to the subsequent middleware
          const user = await (
            await User.findOne({ _id: result.sub })
          ).populate("role");
          req.user = user;
          next();
        } else {
          return res.status(401).json({
            status: false,
            message: "the given token is not valid",
          });
        }
      } catch (err) {
        // Throw an error just in case anything goes wrong with verification
        throw new Error(err);
      }
    } else {
      result = {
        error: `Authentication error. Token required.`,
        status: 401,
      };
      res.status(401).send(result);
    }
  },
};
