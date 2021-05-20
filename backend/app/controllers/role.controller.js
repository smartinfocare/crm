const Role = require('../models/role.model');


exports.roles = (req, res) => {
    Role.find().select('-__v').then(data => {
          res.status(200).json(data);
        }).catch(error => {
          console.log(error);
          res.status(500).json({
              message: "Error!",
              error: error
          });
        });
  };
  