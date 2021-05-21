const mongoose = require("mongoose");

const SourceSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Source", SourceSchema);
