const mongoose = require("mongoose");

const NotesSchema = mongoose.Schema(
  {
    subject: { type: String },
    doc:{type:String},
    deal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lead",
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

module.exports = mongoose.model("Notes", NotesSchema);
