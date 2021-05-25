const User = require("../models/user.model");
const { sendOtpMail } = require("../service/sendMailService");
const { onError } = require("../middleware/error-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
var rand = require("random-key");

exports.createUser = async (req, res) => {
  try {
    let email = await User.findOne({ email: email });
    if (!email) {
      const key = rand.generate();
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
        mobileNumber: req.body.mobileNo,
        status: req.body.status,
        key: key,
      });
      // Save a User in the MongoDB
      user
        .save()
        .then((data) => {
          let payload = {
            email: req.body.email,
            link: `http://localhost:3000/createpassword/${key}`,
          };
          sendOtpMail(payload);
          res.status(200).json(data);
        })
        .catch((err) => {
          res.status(500).json({
            message: "Fail!",
            error: err.message,
          });
        });
    } else {
      return res.status(409).json({
        status: false,
        message: "this email already exist",
      });
    }
  } catch (error) {
    return onError(req, res, error);
  }
};

exports.users = (req, res) => {
  try {
    User.find()
      .select("-__v")
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          message: "Error!",
          error: error,
        });
      });
  } catch (error) {
    return onError(req, res, error);
  }
};

exports.getUserById = (req, res) => {
  try {
    User.findById(req.params.id)
      .populate("role")
      .then((user) => {
        res.status(200).json(user);
      })
      .catch((err) => {
        if (err.kind === "ObjectId") {
          return res.status(404).send({
            message: "user not found with id " + req.params.id,
            error: err,
          });
        }
        return res.status(500).send({
          message: "Error retrieving user with id " + req.params.id,
          error: err,
        });
      });
  } catch (error) {
    return onError(req, res, error);
  }
};

exports.updateRole = (req, res) => {
  try {
    // Find user and update it
    User.findByIdAndUpdate(
      req.body._id,
      {
        role: req.body.role,
      },
      { new: true }
    )
      .select("-__v")
      .then((user) => {
        if (!user) {
          return res.status(404).send({
            message:
              "Error -> Can NOT update a user role with id = " + req.body.id,
            error: "Not Found!",
          });
        }
        res.status(200).send({
          data: user,
          message: "role updated successfully",
        });
      })
      .catch((err) => {
        return res.status(500).send({
          message:
            "Error -> Can not update a user role with id = " + req.body.id,
          error: err.message,
        });
      });
  } catch (error) {
    return onError(req, res, error);
  }
};

exports.updateStatus = (req, res) => {
  try {
    User.findByIdAndUpdate(
      req.body._id,
      {
        isEnabled: req.body.isEnabled,
      },
      { new: true }
    )
      .select("-__v")
      .then((user) => {
        if (!user) {
          return res.status(404).send({
            message: `Error -> Can NOT  ${req.body.isEnabled}  user with id = " + ${req.body._id}`,
            error: "Not Found!",
          });
        }
        res.status(200).send({
          data: user,
          message: `user ability is set to ${user.isEnabled}`,
        });
      })
      .catch((err) => {
        return res.status(500).send({
          message: `Error -> Can NOT  ${req.body.isEnabled}  user with id = " + ${req.body._id}`,
          error: err.message,
        });
      });
  } catch (error) {
    return onError(req, res, error);
   }
};

exports.setPassword = async (req, res) => {
  try {
    let resp = await User.findOne({ key: req.params.key });
    if (resp) {
      let password = await bcrypt.hash(req.body.password, 10);
      let updatePassword = await User.updateOne(
        { key: req.params.key },
        { password: password }
      );
      if (updatePassword && updatePassword.ok == 1) {
        res.status(200).send({
          message: "your password created successfully ",
        });
      } else {
        res.status(400).send({
          message: "bad request please try again",
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
