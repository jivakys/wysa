const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  user_id: { type: String, required: true, index: true },
  question_id: { type: String, required: true },
  option_id: String,
  module_id: String,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("History", historySchema);
