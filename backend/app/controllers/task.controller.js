const e = require("express");
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
      lead:data.lead, 
      assignTo:data.assignTo,
      assignBy:req.user._id,
      details:data.details,
      docs:data.docs
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


exports.getTasksByLeadId = async (req,res)=>{
    let lead = req.params.id;
    try {
        const findTask = await Task.find({lead:lead})
        .populate("assignTo")
        .populate("assignBy");;
        if(findTask){
            return res.status(200).json({
                status: true,
                data:findTask
              });

        }else{
            return res.status(404).json({
                status: false,
                message: "no data found",
              });
        }
    } catch (error) {
        onError(req, res, error);
      }
}