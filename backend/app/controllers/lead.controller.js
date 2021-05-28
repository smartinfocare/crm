const Lead = require("../models/lead.model");
const { onError } = require("../middleware/error-handler");
const Role = require("../models/role.model");
const Team = require("../models/team.model");
const e = require("express");

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
        if (findTeam.length != 0) {
          const findLead = await Lead.find({ assignUser: userId })
            .populate("status")
            .populate("source")
            .populate("assignUser")
            .populate("assignTeam");
          for (let i = 0; i < findTeam.length; i++) {
            const element = findTeam[i];
            let members = element.members;
            const findMyTeamLead = await Lead.find({
              assignTeam: element._id,
            })
              .populate("status")
              .populate("source")
              .populate("assignUser")
              .populate("assignTeam");
            if (findMyTeamLead.length != 0) {
              findMyTeamLead.map(async (ele) => {
                findLead.push(ele);
              });
            }
            if (members.length != 0) {
              members.map(async (member) => {
                const findMyUserLead = await Lead.find({
                  assignUser: member,
                })
                  .populate("status")
                  .populate("source")
                  .populate("assignUser")
                  .populate("assignTeam");
                if (findMyUserLead.length != 0) {
                  findMyUserLead.map(async (user) => {
                    findLead.push(user);
                  });
                }
              });
            }
          }
          return res.status(200).json({
            status: true,
            data: findLead,
          });
        } else {
          const findLead = await Lead.find({ assignUser: userId })
            .populate("status")
            .populate("source")
            .populate("assignUser")
            .populate("assignTeam");
          if (findLead) {
            return res.status(200).json({
              status: true,
              data: findLead,
            });
          } else {
            return res.status(404).json({
              status: false,
              message: "no data found",
            });
          }
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

exports.getLeadById = async (req, res) => {
  let id = req.params.id;
  try {
    const findLead = await Lead.findOne({ _id: id })
      .populate("status")
      .populate("source")
      .populate("assignUser")
      .populate("assignTeam");
    if (findLead) {
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
  } catch (error) {
    return onError(req, res, error);
  }
};

exports.changeLeadStatus = async (req, res) => {
  try {
    const updateData = await Lead.updateOne(
      { _id: req.body._id },
      { status: req.body.status }
    );
    if (updateData.ok == 1) {
      return res.status(200).json({
        status: true,
        message: "status updated successfully",
      });
    } else {
      return res.status(400).json({
        status: false,
        message: "bad request data not updated",
      });
    }
  } catch (error) {
    onError(req, res, error);
  }
};

exports.changeLeadSource = async (req, res) => {
  try {
    const updateData = await Lead.updateOne(
      { _id: req.body._id },
      { source: req.body.source }
    );
    if (updateData.ok == 1) {
      return res.status(200).json({
        status: true,
        message: "source updated successfully",
      });
    } else {
      return res.status(400).json({
        status: false,
        message: "bad request data not updated",
      });
    }
  } catch (error) {
    onError(req, res, error);
  }
};

exports.getAllLeads = async (req, res) => {
  try {
    const resp = await Lead.find();
    if (resp) {
      return res.status(200).json({
        status: true,
        data: resp,
      });
    } else {
      return res.status(404).json({
        status: false,
        message: "no data found",
      });
    }
  } catch (error) {
    onError(req, res, error);
  }
};
