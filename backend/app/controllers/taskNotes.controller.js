const taskNotes = require("../models/taskNotes.model");
exports.createTaskNotes = async (req, res) => {
  try {
    let data = req.body;
    let payload = {
      subject: data.subject,
      title: data.title,
      docs: data.docs,
      task: data.task,
      addedBy: req.user._id,
    };
    const notes = await new taskNotes(payload);
    const resp = await notes.save();
    if (resp) {
      return res.status(200).json({
        status: true,
        data: resp,
        message: "Task Notes added success fully",
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

exports.getTaskNotesById = async (req, res) => {
  try {
    let id = req.params.id;
    const resp = await taskNotes.find({ task: id }).populate("addedBy");

    if (resp) {
      return res.status(200).json({
        status: true,
        data: resp,
      });
    } else {
      return res.status(404).json({
        status: false,
        message: "data not found",
      });
    }
  } catch (error) {}
};
