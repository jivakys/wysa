require("dotenv").config();
const mongoose = require("mongoose");
const Module = require("./models/moduleModel");
const Question = require("./models/questionModel");
const UserSession = require("./models/userSessionModel");
const History = require("./models/historyModel");

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to MongoDB for seeding...");

    // Clean start
    await Module.deleteMany({});
    await Question.deleteMany({});
    await UserSession.deleteMany({});
    await History.deleteMany({});

    // 1. Create Modules
    const modules = await Module.create([
      { _id: "mod_onboarding", name: "User Onboarding" },
      { _id: "mod_preferences", name: "User Preferences" },
    ]);

    // 2. Create Questions
    await Question.create([
      {
        _id: "q1",
        module_id: "mod_onboarding",
        text: "Welcome! Ready to set your preferences?",
        options: [
          {
            _id: "o1_yes",
            label: "Yes",
            next_question_id: "q2",
            target_module_id: "mod_preferences",
          },
          { _id: "o1_no", label: "Later", next_question_id: "q_end" },
        ],
      },
      {
        _id: "q2",
        module_id: "mod_preferences",
        text: "Dark mode or Light mode?",
        is_checkpoint: true,
        options: [
          { _id: "o2_dark", label: "Dark", next_question_id: "q_end" },
          { _id: "o2_light", label: "Light", next_question_id: "q_end" },
        ],
      },
      {
        _id: "q_end",
        module_id: "mod_onboarding",
        text: "All set! Thank you.",
        options: [],
      },
    ]);

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seed();
