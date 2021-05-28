const e = require("express");
const { on } = require("nodemon");
const { onError } = require("../middleware/error-handler");
const Lead = require("../models/lead.model");
const Role = require("../models/role.model");
const Task = require("../models/task.model");

exports.createTask = async (req, res) => {
  try {
    let data = req.body;
    let payload = {
      taskName: data.taskName,
      dueDate: data.dueDate,
      time: data.time,
      lead: data.lead,
      assignTo: data.assignTo,
      assignBy: req.user._id,
      details: data.details,
      docs: data.docs,
    };
    const task = await new Task(payload);
    const resp = await task.save();
    if (resp) {
      return res.status(200).json({
        status: true,
        data: resp,
        message: "task added success fully",
      });
    } else {
      return res.status(400).json({
        status: false,
        message: "bad request :data not added",
      });
    }
  } catch (error) {
    onError(req, res, error);
  }
};

exports.getTasksByLeadId = async (req, res) => {
  let lead = req.params.id;
  try {
    const findTask = await Task.find({ lead: lead })
      .populate("assignTo")
      .populate("assignBy");
    if (findTask) {
      return res.status(200).json({
        status: true,
        data: findTask,
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

exports.getTaskByRoleAndUserId = async (req, res) => {
  let userId = req.user._id;
  let roleId = req.user.role;
  try {
    const findRole = await Role.findOne({ _id: roleId });
    if (findRole) {
      if (
        findRole.title == process.env.ADMIN ||
        findRole.title == process.env.SUPER_ADMIN
      ) {
        const task = await Task.find().populate("assignBy");
        if (task) {
          return res.status(200).json({
            status: true,
            data: task,
          });
        } else {
          return res.status(404).json({
            status: false,
            message: "no data found",
          });
        }
      } else {
        if (
          findRole.title == process.env.SENIOR_USER ||
          findRole.title == process.env.SIMPLE_USER
        ) {
          const resp = await Task.find({ assignTo: userId })
            .populate("assignBy")
            .populate("assignTo");
          const resp1 = await Task.find({ assignBy: userId })
            .populate("assignBy")
            .populate("assignTo");
          if (resp1.length != 0) {
            resp1.map(async (element) => {
              resp.push(element);
            });
          }
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
        } else {
          return res.status(401).json({
            status: false,
            message: "you are not authorized",
          });
        }
      }
    } else {
      return res.status(401).json({
        status: false,
        message: "you are not authorized",
      });
    }
  } catch (error) {
    onError(req, res, error);
  }
};

exports.getTaskById = async (req, res) => {
  try {
    let taskId = req.params.id;
    const resp = await Task.findOne({ _id: taskId })
      .populate("assignTo")
      .populate("assignBy")
      .populate("lead");
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

exports.updateTask = async (req, res) => {
  try {
    let id = req.params.id;
    let data = req.body;
    const findTask = await Task.findOne({ _id: id });
    if (findTask) {
      const updateData = await Task.updateOne({ _id: id }, data);
      if (updateData.ok == 1) {
        const getData = await Task.findOne({ _id: id });
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
        message: "task not found",
      });
    }
  } catch (error) {
    return onError(req, res, error);
  }
};

exports.deleteTaskById = async (req, res) => {
  try {
    let findTask = await Task.findOne({ _id: req.params.id });
    if (findTask) {
      let removeData = await Task.deleteOne({ _id: req.params.id });
      if (removeData && removeData.ok == 1) {
        const getTask = await Task.find();
        return res.status(200).json({
          message: "data deleted successfully",
          data: getTask,
        });
      } else {
        return res.status(400).json({
          message: "bad request",
        });
      }
    } else {
      return res.status(404).json({
        message: "task no found",
      });
    }
  } catch (error) {
    return onError(req, res, error);
  }
};
