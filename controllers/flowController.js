const FlowService = require("../services/flowServices");

const start = async (req, res) => {
  try {
    const userId = req.user._id;
    const { moduleId } = req.body;
    if (!moduleId) {
      return res.status(400).json({ error: "moduleId is required" });
    }
    const question = await FlowService.startModule(userId, moduleId);
    res.status(200).json(question);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const respond = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const { optionId } = req.body;
    if (!optionId) {
      return res.status(400).json({ error: "optionId is required" });
    }
    const nextStep = await FlowService.processResponse(userId, optionId);
    res.status(200).json(nextStep);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const sync = async (req, res) => {
  try {
    const userId = req.user._id;
    const { questionId } = req.query;
    if (!questionId) {
      return res.status(400).json({ error: "questionId is required" });
    }
    const currentQuestion = await FlowService.syncToQuestion(
      userId,
      questionId,
    );
    res.status(200).json(currentQuestion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const history = await FlowService.getHistory(userId);
    res.status(200).json(history);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  start,
  respond,
  sync,
  getHistory,
};
