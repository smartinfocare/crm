const mongoose = require("mongoose");

const TaskNotesSchema = mongoose.Schema(
  {
    subject: { type: String },
    title: { type: String },
    docs:{type:String},
    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
        default: null,
      },
    addedBy: {  
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("TaskNotes", TaskNotesSchema);
