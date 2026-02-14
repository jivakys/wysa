const mongoose = require("mongoose");

const moduleSchema = new mongoose.Schema({
  _id: String,
  name: { type: String, required: true },
});

module.exports = mongoose.model("Module", moduleSchema);
