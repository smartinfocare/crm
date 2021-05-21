const mongoose = require("mongoose");

const LeadSchema = mongoose.Schema(
  {
    name: { type: String },
    source: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Source",
    },
    status: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Status",
    },
    phoneNumber: Number,

    email: {
      type: String,
      unique: true,
    },
    companyName: String,
    location: String,
    assignTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      default: null,
    },
    assignUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lead", LeadSchema);
