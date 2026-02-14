const FlowService = require("../services/FlowService");

const start = async (req, res) => {
  try {
    const { userId, moduleId } = req.body;
    if (!userId || !moduleId) {
      return res
        .status(400)
        .json({ error: "userId and moduleId are required" });
    }
    const question = await FlowService.startModule(userId, moduleId);
    res.status(200).json(question);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const respond = async (req, res) => {
  try {
    const { userId, optionId } = req.body;
    if (!userId || !optionId) {
      return res
        .status(400)
        .json({ error: "userId and optionId are required" });
    }
    const nextStep = await FlowService.processResponse(userId, optionId);
    res.status(200).json(nextStep);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const sync = async (req, res) => {
  try {
    const { userId, questionId } = req.query;
    if (!userId || !questionId) {
      return res
        .status(400)
        .json({ error: "userId and questionId are required" });
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
    const { userId } = req.params;
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
