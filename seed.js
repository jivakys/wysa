require("dotenv").config();
const mongoose = require("mongoose");
const Module = require("./models/moduleModel");
const Question = require("./models/questionModel");
const UserSession = require("./models/userSessionModel");
const History = require("./models/historyModel");

const seedPracticeQuiz = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to MongoDB for Practice Seeding...");

    // Clean start
    await Module.deleteMany({});
    await Question.deleteMany({});
    await UserSession.deleteMany({});
    await History.deleteMany({});

    // 1. Create Learning Modules
    await Module.create([
      { _id: "mod_node", name: "Node.js Basics" },
      { _id: "mod_express", name: "Express.js Framework" },
      { _id: "mod_mongodb", name: "MongoDB Fundamentals" },
    ]);

    // 2. Create Questions for Node.js
    await Question.create([
      {
        _id: "node_q1",
        module_id: "mod_node",
        text: "What is Node.js?",
        options: [
          {
            _id: "n1_opt1",
            label: "A JavaScript Runtime built on Chrome V8",
            next_question_id: "node_q2",
          },
          {
            _id: "n1_opt2",
            label: "A Frontend Framework",
            next_question_id: "node_q1",
          }, // Loops back on wrong answer
          {
            _id: "n1_opt3",
            label: "A Type of Database",
            next_question_id: "node_q1",
          },
        ],
      },
      {
        _id: "node_q2",
        module_id: "mod_node",
        text: "Which core module is used to handle file paths?",
        options: [
          { _id: "n2_opt1", label: "fs", next_question_id: "node_q2" },
          { _id: "n2_opt2", label: "path", next_question_id: "node_q3" },
          { _id: "n2_opt3", label: "url", next_question_id: "node_q2" },
        ],
      },
      {
        _id: "node_q3",
        module_id: "mod_node",
        text: "Node.js is single-threaded. True or False?",
        options: [
          {
            _id: "n3_opt1",
            label: "True",
            next_question_id: "exp_q1",
            target_module_id: "mod_express",
          },
          { _id: "n3_opt2", label: "False", next_question_id: "node_q3" },
        ],
      },
    ]);

    // 3. Create Questions for Express.js (Module Switch Happens Here)
    await Question.create([
      {
        _id: "exp_q1",
        module_id: "mod_express",
        is_checkpoint: true, // Reset context to focus on Express
        text: 'In Express, what is "Middleware"?',
        options: [
          {
            _id: "e1_opt1",
            label: "A function with access to req and res objects",
            next_question_id: "exp_q2",
          },
          {
            _id: "e1_opt2",
            label: "A type of database",
            next_question_id: "exp_q1",
          },
        ],
      },
      {
        _id: "exp_q2",
        module_id: "mod_express",
        text: "Which method is used to define a POST route?",
        options: [
          {
            _id: "e2_opt1",
            label: "app.post()",
            next_question_id: "mongo_q1",
            target_module_id: "mod_mongodb",
          },
          { _id: "e2_opt2", label: "app.get()", next_question_id: "exp_q2" },
        ],
      },
    ]);

    // 4. Create Questions for MongoDB
    await Question.create([
      {
        _id: "mongo_q1",
        module_id: "mod_mongodb",
        text: "MongoDB is a _____ database.",
        options: [
          { _id: "m1_opt1", label: "Relational", next_question_id: "mongo_q1" },
          {
            _id: "m1_opt2",
            label: "NoSQL (Document-based)",
            next_question_id: "mongo_end",
          },
        ],
      },
      {
        _id: "mongo_end",
        module_id: "mod_mongodb",
        text: "🎉 Congratulations! You have completed the Full Stack Roadmap. Ready to build?",
        options: [],
      },
    ]);

    console.log("Database seeded with Developer Practice Quiz!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedPracticeQuiz();
