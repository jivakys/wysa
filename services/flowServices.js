const Module = require("../models/moduleModel");
const Question = require("../models/questionModel");
const UserSession = require("../models/userSessionModel");
const History = require("../models/historyModel");
const mongoose = require("mongoose");

//  Internal helper to log history
const _logHistory = async (userId, questionId, optionId, moduleId) => {
  return History.create({
    user_id: userId,
    question_id: questionId,
    option_id: optionId,
    module_id: moduleId,
  });
};

//  Requirement 1: Start a module

const startModule = async (userId, moduleId) => {
  const module = await Module.findById(moduleId);
  if (!module) throw new Error("Module not found");

  const firstQuestion = await Question.findOne({ module_id: moduleId });
  if (!firstQuestion) throw new Error("No questions found in this module");

  // Start Mongoose Transaction
  const mongooseSession = await mongoose.startSession();
  mongooseSession.startTransaction();

  try {
    // Requirement 4: Maintain active state
    await UserSession.findByIdAndUpdate(
      userId,
      {
        current_question_id: firstQuestion._id,
        current_module_id: moduleId,
        $set: { [`context_by_module.${moduleId}`]: {} },
      },
      { upsert: true, session: mongooseSession },
    );

    // Requirement 4: Maintain complete history
    await _logHistory(
      userId,
      firstQuestion._id,
      null,
      moduleId,
      mongooseSession,
    );

    await mongooseSession.commitTransaction();
    return firstQuestion;
  } catch (error) {
    await mongooseSession.abortTransaction();
    throw error;
  } finally {
    mongooseSession.endSession();
  }
};

/**
 * Requirement 2 & 3: Selection moves user within or between modules
 */
const processResponse = async (userId, optionId) => {
  const session = await UserSession.findById(userId);
  if (!session) throw new Error("No active session. Please start a module.");

  const currentQuestion = await Question.findById(session.current_question_id);
  if (!currentQuestion) throw new Error("Current question state lost");

  // Requirement 7: Defensive - Invalid options
  console.log(
    `User ${userId} is on question ${session.current_question_id}. options:`,
    currentQuestion.options.map((o) => o._id),
  );
  console.log(`Requested optionId: ${optionId}`);

  const option = currentQuestion.options.id(optionId);
  if (!option) throw new Error("Invalid option for this question");

  const nextQuestionId = option.next_question_id;
  if (!nextQuestionId) return { message: "End of flow reached" };

  // Requirement 7: Defensive - Broken question references
  const nextQuestion = await Question.findById(nextQuestionId);
  if (!nextQuestion) throw new Error("Broken flow: Next question not found");

  const targetModuleId = option.target_module_id || nextQuestion.module_id;

  // Requirement 5: Checkpoints reset module context
  const updateData = {
    current_question_id: nextQuestionId,
    current_module_id: targetModuleId,
  };

  if (nextQuestion.is_checkpoint) {
    updateData[`context_by_module.${targetModuleId}`] = {};
  }

  // Start Mongoose Transaction
  const mongooseSession = await mongoose.startSession();
  mongooseSession.startTransaction();

  try {
    await UserSession.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { session: mongooseSession },
    );
    await _logHistory(
      userId,
      nextQuestionId,
      optionId,
      targetModuleId,
      mongooseSession,
    );

    await mongooseSession.commitTransaction();
    return nextQuestion;
  } catch (error) {
    await mongooseSession.abortTransaction();
    throw error;
  } finally {
    mongooseSession.endSession();
  }
};

//  Requirement 6: Handle deep links

const syncToQuestion = async (userId, requestedQuestionId) => {
  const session = await UserSession.findById(userId);
  if (!session) throw new Error("User has no active session");

  const requestedQuestion = await Question.findById(requestedQuestionId);
  // If question doesn't exist, return latest valid state
  if (!requestedQuestion) return Question.findById(session.current_question_id);

  // Check if user has visited this question before
  const wasVisited = await History.findOne({
    user_id: userId,
    question_id: requestedQuestionId,
  });

  if (wasVisited) {
    await UserSession.findByIdAndUpdate(userId, {
      current_question_id: requestedQuestionId,
      current_module_id: requestedQuestion.module_id,
    });
    return requestedQuestion;
  }

  // Requirement 6: Return latest valid question based on current state
  return Question.findById(session.current_question_id);
};

//  Requirement 4: Complete conversation history

const getHistory = async (userId) => {
  return History.find({ user_id: userId }).sort({ timestamp: 1 });
};

module.exports = {
  startModule,
  processResponse,
  syncToQuestion,
  getHistory,
};
