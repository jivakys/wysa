const mongoose = require("mongoose");

const userSessionSchema = new mongoose.Schema(
  {
    _id: String,
    current_question_id: String,
    current_module_id: String,
    context_by_module: {
      type: Map,
      of: Object,
      default: {},
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("UserSession", userSessionSchema);
