const { onError } = require("../middleware/error-handler");
const Status = require("../models/status.model");

exports.createStatus = async (req, res) => {
  try {
    let data = req.body;
    if (data && data.title) {
      const status = new Status({
        title: data.title,
      });
      const resp = await status.save();
      if (resp) {
        res.status(200).json({
          data: resp,
          message: "Status add successfully",
        });
      } else {
        res.status(400).send({
          message: "bad request:please try again",
        });
      }
    } else {
      res.status(404).send({
        message: "please enter some values",
      });
    }
  } catch (error) {
    return onError(req, res, error);
  }
};

exports.getStatus = (req, res) => {
  try {
    Status.find()
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
