const mongoose = require("mongoose");

const TaskSchema = mongoose.Schema(
  {
    taskName: { type: String },
    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      default: null,
    },
    dueDate: { type: String },
    time: { type: String },
    docs: { type: String },
    details: { type: String },
    assignBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    assignTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", TaskSchema);
