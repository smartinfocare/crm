const Lead = require("../models/lead.model");
const { onError } = require("../middleware/error-handler");
const Role = require("../models/role.model");
const Team = require("../models/team.model");
exports.createLead = async (req, res) => {
  try {
    let user = "Admin";
    let data = req.body;
    let email = data.email;
    let payload = {
      name: data.name,
      email: data.email,
      companyName: data.companyName,
      phoneNumber: data.phoneNumber,
      location: data.location,
      source: data.source,
      status: data.status,
      assignTeam: data.assignTeam ? data.assignTeam : null,
      assignUser: data.assignUser ? data.assignUser : null,
    };
    if (data) {
      const findLead = await Lead.findOne({ email: email });
      if (!findLead) {
        if (user === "Admin") {
          const lead = await new Lead(payload);
          const resp = await lead.save();
          if (resp) {
            return res.status(200).json({
              status: true,
              message: "data added successfully",
              data: resp,
            });
          } else {
            return res.status(400).json({
              status: false,
              message: "bad request : data not added",
            });
          }
        } else {
          return res.status(403).json({
            status: false,
            message: "you are not authorized",
          });
        }
      } else {
        return res.status(409).json({
          status: false,
          message: "this email is already exist",
        });
      }
    } else {
      return res.status(404).json({
        status: false,
        message: "please enter data to create the lead",
      });
    }
  } catch (error) {
    return onError(req, res, error);
  }
};

exports.getLeads = async (req, res) => {
  let roleId = req.user.role._id;
  let userId = req.user._id;
  try {
    const role = await Role.findOne({ _id: roleId });
    if (
      role.title == process.env.SUPER_ADMIN ||
      role.title == process.env.ADMIN
    ) {
      const resp = await Lead.find()
        .populate("status")
        .populate("source")
        .populate("assignUser")
        .populate("assignTeam");
      if (resp) {
        return res.status(200).json({
          status: true,
          message: "data found",
          data: resp,
        });
      } else {
        return res.status(404).json({
          status: false,
          message: "no data found",
        });
      }
    } else {
      if (
        role.title == process.env.SIMPLE_USER ||
        role.title == process.env.SENIOR_USER
      ) {
        const findTeam = await Team.find({ teamLeader: userId }).populate(
          "teamLeader"
        );
        const findLead = await Lead.find({ assignUser: userId })
          .populate("status")
          .populate("source")
          .populate("assignUser")
          .populate("assignTeam");
        if (findLead) {
          for (let i = 0; i < findTeam.length; i++) {
            const element = findTeam[i];
            const findMyTeamLead = await Lead.findOne({
              assignTeam: element._id,
            })
              .populate("status")
              .populate("source")
              .populate("assignUser")
              .populate("assignTeam");
            if (findMyTeamLead) {
              findLead.push(findMyTeamLead);
            }
          }
          return res.status(200).json({
            status: true,
            data: findLead,
          });
        } else {
          return res.status(404).json({
            status: false,
            message: "data not found",
          });
        }
      } else {
        return res.status(401).json({
          status: false,
          message: "you are not authorized",
        });
      }
    }
  } catch (error) {
    return onError(req, res, error);
  }
};

exports.deleteLeadById = async (req, res) => {
  try {
    let findLead = await Lead.findOne({ _id: req.params.id });
    if (findLead) {
      let removeData = await Lead.deleteOne({ _id: req.params.id });
      if (removeData && removeData.ok == 1) {
        const getTeam = await Lead.find();
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
        message: "lead no found",
      });
    }
  } catch (error) {
    return onError(req, res, error);
  }
};

exports.updateLeadById = async (req, res) => {
  try {
    let id = req.params.id;
    let data = req.body;
    let payload = {
      name: data.name,
      email: data.email,
      companyName: data.companyName,
      phoneNumber: data.phoneNumber,
      location: data.location,
      source: data.source,
      status: data.status,
      assignTeam: data.assignTeam ? data.assignTeam : null,
      assignUser: data.assignUser ? data.assignUser : null,
    };
    const findLead = await Lead.findOne({ _id: id });
    if (findLead) {
      const updateData = await Lead.updateOne({ _id: id }, payload);
      if (updateData.ok == 1) {
        const getData = await Lead.findOne({ _id: id });
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
        message: "lead not found",
      });
    }
  } catch (error) {
    return onError(req, res, error);
  }
};

exports.getLeadById = (req, res) => {
  try {
    Lead.findById(req.params.id)
      .then((lead) => {
        res.status(200).json(lead);
      })
      .catch((err) => {
        if (err.kind === "ObjectId") {
          return res.status(404).send({
            message: "lead not found with id " + req.params.id,
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
