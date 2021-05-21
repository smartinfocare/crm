const Role = require('../models/role.model');
const {onError} = require('../middleware/error-handler')

exports.roles = (req, res) => {
  try {
    Role.find().select('-__v').then(data => {
          res.status(200).json(data);
        }).catch(error => {
          console.log(error);
          res.status(500).json({
              message: "Error!",
              error: error
          });
        });
      }  catch (error) {
        return onError(req, res, error);
      }
    };
  