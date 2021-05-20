const User = require('../models/user.model');
const {sendOtpMail} = require('../service/sendMailService');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
var rand = require("random-key");
exports.createUser = (req, res) => {
const key = rand.generate();  
    const user = new User   ({
                          name: req.body.name,
                          email: req.body.email,
                          role: req.body.role,
                          mobileNumber:req.body.mobileNo,
                          status: req.body.status,
                          key:key
                        });
    // Save a User in the MongoDB
    user. save().then(data => {
        let payload = {
          email:req.body.email,
          link:`http://localhost:3000/createpassword/${key}`,
        }
                  sendOtpMail(payload);
                    res.status(200).json(data);
                }).catch(err => {
                    res.status(500).json({
                      message: "Fail!",
                      error: err.message
                    });
                });
};




exports.users = (req, res) => {
  User.find().select('-__v').then(data => {
        res.status(200).json(data);
      }).catch(error => {
        console.log(error);
        res.status(500).json({
            message: "Error!",
            error: error
        });
      });
};




exports.getUserById = (req , res )=>{
  User.findById(req.params.id).populate("role").then(user => {
    res.status(200).json(user);
  }).catch(err => {
      if(err.kind === 'ObjectId') {
          return res.status(404).send({
              message: "user not found with id " + req.params.id,
              error: err
          });                
      }
      return res.status(500).send({
          message: "Error retrieving user with id " + req.params.id,
          error: err
      });
  });
}



exports.updateRole = (req, res) => {
  // Find user and update it
  User.findByIdAndUpdate(
                    req.body._id, 
                    {
                      role: req.body.role,  
                    }, 
                      {new: true}
                  ).select('-__v')
      .then(user => {
          if(!user) {
              return res.status(404).send({
                  message: "Error -> Can NOT update a user role with id = " + req.body.id,
                  error: "Not Found!"
              });
          } 
        res.status(200).send({
        data:user,
        message:"role updated successfully"
          });
      }).catch(err => {
          return res.status(500).send({
            message: "Error -> Can not update a user role with id = " + req.body.id,
            error: err.message
          });
      });
};



exports.updateStatus = (req, res) => {
  User.findByIdAndUpdate(
                    req.body._id, 
                    {
                      isEnabled: req.body.isEnabled,
                    }, 
                      {new: true}
                  ).select('-__v')
      .then(user => {
          if(!user) {
              return res.status(404).send({
                  message: `Error -> Can NOT  ${req.body.isEnabled}  user with id = " + ${req.body._id}`,
                  error: "Not Found!"
              });
          }
          res.status(200).send({
            data:user,
            message:`user ablity is set to ${user.isEnabled}` 
          });
      }).catch(err => {
          return res.status(500).send({
            message: `Error -> Can NOT  ${req.body.isEnabled}  user with id = " + ${req.body._id}`,
            error: err.message
          });
      });
};

// exports.loginUserByOtp = async (req,res) =>{
//   let resp = await User.findOne({email:req.body.email});
//   if(resp){
//     let otp = Math.floor(100000 + Math.random() * 900000);
//     const updateUser = await User.updateOne({email:req.body.email},{otp:otp});
//     setTimeout(async function () {
   
//       const delOtp = await userService.updateUser(response.id, upOtp)
//   }, 60000);
//   }else{
//     res.send({
//       message:"user not found"
//     })
//   }
// }

exports.setPassword = async (req,res)=>{
  let resp = await User.findOne({key:req.params.key});
  if(resp){
   let password = await bcrypt.hash(req.body.password, 10, )
   let updatePassword = await User.updateOne({key:req.params.key},{password:password});
  if(updatePassword && updatePassword.ok == 1) {
    res.status(200).send({
      message:"your password created successfully " 
    })
  }else{
    res.status(400).send({
      message:"bad request please try again"
    })
  }
  }else{
    res.status(404).send({
      message:"you are not register in our records"
    })
  }
}


exports.LoginWithPassword = async (req,res)=>{
  let password = req.body.password;
  let resp = await User.findOne({email:req.body.email});
  if(resp){
  if(resp && resp.isEnabled == true){
  let checkPassword = await bcrypt.compare(password, resp.password)
  if(checkPassword){
    let secret ="fuhguidskjgbvh8que823uy8hfuir295r2rff1541f32103210f231f354";
    const token = jwt.sign({ sub: resp._id }, secret, { expiresIn: '7d' });
  res.status(200).send({
  message:"welcome to smartinfo care solution",
  Token:token
})
  }else{
    res.status(400).send({
      message:"the password is not match"
    })
  }
}else{
  res.status(403).send({
    error:"you are not enabled for login"
  })
}
  }else{
    res.status(404).send({
      message:"you are not register in our records"
    })
  }

}