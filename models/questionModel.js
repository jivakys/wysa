const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema({
  _id: String,
  label: { type: String, required: true },
  next_question_id: String,
  target_module_id: String,
});

const questionSchema = new mongoose.Schema({
  _id: String,
  module_id: { type: String, ref: "Module", required: true },
  text: { type: String, required: true },
  is_checkpoint: { type: Boolean, default: false },
  options: [optionSchema],
});

module.exports = mongoose.model("Question", questionSchema);
