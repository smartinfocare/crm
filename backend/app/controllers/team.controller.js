const Team = require('../models/team.model');
const {sendTeamMail} = require('../service/teamMailService');

exports.teams = (req, res) => {
    Team.find().populate("members").select('-__v').then(data => {
          res.status(200).json(data);
        }).catch(error => {
          console.log(error);
          res.status(500).json({
              message: "Error!",
              error: error
          });
        });
  };
  
  exports.createTeam = async (req,res)=>{
      let data = req.body;
      let members = req.body.members;
      if(data && data.name){
    const team = new Team   ({
        name: data.name,
        members: members,
        teamLeader:data.teamLeader
      });
     const resp = await team.save();
     if(resp){
         members.forEach(element => {
             let payload={
                 name:data.name,
                 email:element.email
             }
             sendTeamMail(payload);
         });
         res.status(200).json({
             data:resp,
             message:"user add successfully"
         })
     }else{
         res.status(400).send({
             message:"bad request:please try again"
         })
     }
    }else{
        res.status(404).send({
            message:"please enter some values"
        })
    }
  }



exports.getTeamById = (req , res )=>{
    Team.findById(req.params.id).populate("members").then(team => {
      res.status(200).json(team);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "team not found with id " + req.params.id,
                error: err
            });                
        }
        return res.status(500).send({
            message: "Error retrieving user with id " + req.params.id,
            error: err
        });
    });
  }
  
  exports.deleteTeamById = async (req,res)=>{
      let findTeam = await Team.findOne({_id:req.params.id});
      if(findTeam){
let removeData = await Team.deleteOne({_id:req.params.id});
if(removeData && removeData.ok == 1){
const getTeam =await Team.find();
return res.status(200).json({
    message:"data deleted sucessfully",
    data:getTeam
})
}else{
    return res.status(400).json({
        message:"bad request"
    })
}
      }else{
          return res.status(404).json({
              message:"team no found"
          })
      }
  }