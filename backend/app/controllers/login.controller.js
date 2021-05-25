const User = require("../models/user.model");
const { onError } = require("../middleware/error-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
exports.LoginWithPassword = async (req, res) => {
    try {
      let password = req.body.password;
      let resp = await User.findOne({ email: req.body.email });
      if (resp) {
        if (resp && resp.isEnabled == true) {
          let checkPassword = await bcrypt.compare(password, resp.password);
          if (checkPassword) {
            const token = jwt.sign({ sub: resp._id },process.env.SECRET_KEY, {
              expiresIn: "7d",
            });
            res.cookie('jwt',token,{
              maxAge:24*60*60*1000,
              httpOnly:true
            })
            res.status(200).send({
              message: "welcome to smartinfo care solution",
              Token: token,
              
            });
          } else {
            res.status(400).send({
              message: "the password is not match",
            });
          }
        } else {
          res.status(403).send({
            error: "you are not enabled for login",
          });
        }
      } else {
        res.status(404).send({
          message: "you are not register in our records",
        });
      }
    } catch (error) {
      return onError(req, res, error);
    }
  };
  