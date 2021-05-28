const Notes = require("../models/notes.model");

exports.createNotes = async (req, res) => {
  try {
    let data = req.body;
    let payload = {
      subject: data.subject,
      title: data.title,
      docs: data.docs,
      lead: data.lead,
      addedBy: req.user._id,
    };
    const notes = await new Notes(payload);
    const resp = await notes.save();
    if (resp) {
      return res.status(200).json({
        status: true,
        data: resp,
        message: "notes added success fully",
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

exports.getNotesByLeadId = async (req, res) => {
  let lead = req.params.id;
  try {
    const findNotes = await Notes.find({ lead: lead }).populate("addedBy");
    if (findNotes) {
      return res.status(200).json({
        status: true,
        data: findNotes,
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
