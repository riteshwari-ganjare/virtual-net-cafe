const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    documents: { type: [String], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", serviceSchema);