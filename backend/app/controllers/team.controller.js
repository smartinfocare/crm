const Team = require("../models/team.model");
const User = require("../models/user.model");
const { sendTeamMail } = require("../service/teamMailService");
const { onError } = require("../middleware/error-handler");

exports.teams = (req, res) => {
  try {
    Team.find()
      .populate("teamLeader")
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

exports.createTeam = async (req, res) => {
  try {
    let data = req.body;
    let members = req.body.members;
    if (data && data.name) {
      const team = new Team({
        name: data.name,
        members: members,
        teamLeader: data.teamLeader,
      });
      const resp = await team.save();
      if (resp) {
        for (let i = 0; i < members.length; i++) {
          const element = members[i];
          let findUser = await User.findOne({ _id: element });
          let Payload = {
            name: data.name,
            email: findUser.email,
          };
          sendTeamMail(Payload);
        }
        res.status(200).json({
          data: resp,
          message: "team add successfully",
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

exports.getTeamById = (req, res) => {
  try {
    Team.findById(req.params.id)
      .populate("members")
      .then((team) => {
        res.status(200).json(team);
      })
      .catch((err) => {
        if (err.kind === "ObjectId") {
          return res.status(404).send({
            message: "team not found with id " + req.params.id,
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

exports.deleteTeamById = async (req, res) => {
  try {
    let findTeam = await Team.findOne({ _id: req.params.id });
    if (findTeam) {
      let removeData = await Team.deleteOne({ _id: req.params.id });
      if (removeData && removeData.ok == 1) {
        const getTeam = await Team.find();
        return res.status(200).json({
          message: "data deleted successfully",
          data: getTeam,
        });
      } else {
        return res.status(400).json({
          message: "bad request",
        });
      }
    } else {
      return res.status(404).json({
        message: "team no found",
      });
    }
  } catch (error) {
    return onError(req, res, error);
  }
};

exports.updateTeamById = async (req, res) => {
  try {
    let id = req.params.id;
    let data = req.body;
    const findTeam = await Team.findOne({ _id: id });
    if (findTeam) {
      const updateData = await Team.updateOne({ _id: id }, data);
      if (updateData.ok == 1) {
        const getData = await Team.findOne({ _id: id });
        res.status(200).json({
          status: true,
          message: "data updated successfully",
          data: getData,
        });
      } else {
        return res.status(400).json({
          status: false,
          message: "bad request : not updated",
        });
      }
    } else {
      return res.status(404).json({
        status: false,
        message: "team not found",
      });
    }
  } catch (error) {
    return onError(req, res, error);
  }
};
