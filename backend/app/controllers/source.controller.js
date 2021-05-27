const Source = require("../models/source.model");
const { onError } = require("../middleware/error-handler");


exports.createSource = async (req, res) => {
  try {
    let data = req.body;
    if (data && data.title) {
      const source = new Source({
        title: data.title,
      });
      const resp = await source.save();
      if (resp) {
        res.status(200).json({
          data: resp,
          message: "source add successfully",
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

exports.getSource = (req, res) => {
  try {
    Source.find()
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

