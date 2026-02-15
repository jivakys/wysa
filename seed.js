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
      { _id: "mod_node", name: "Node.js Core" },
      { _id: "mod_express", name: "Express.js Framework" },
      { _id: "mod_mongodb", name: "MongoDB & Mongoose" },
    ]);

    // 2. Create Questions for Node.js
    await Question.create([
      {
        _id: "node_01",
        module_id: "mod_node",
        text: "Which of the following describes Node.js correctly?",
        options: [
          {
            _id: "n1_o1",
            label: "Single-threaded, non-blocking I/O",
            next_question_id: "node_02",
          },
          {
            _id: "n1_o2",
            label: "Multi-threaded, blocking I/O",
            next_question_id: "node_01",
          },
          {
            _id: "n1_o3",
            label: "A Browser-based JavaScript library",
            next_question_id: "node_01",
          },
        ],
      },
      {
        _id: "node_02",
        module_id: "mod_node",
        text: "What is the purpose of 'package.json' in a Node project?",
        options: [
          {
            _id: "n2_o1",
            label: "To store database credentials",
            next_question_id: "node_02",
          },
          {
            _id: "n2_o2",
            label: "To list dependencies and scripts",
            next_question_id: "node_03",
          },
          {
            _id: "n2_o3",
            label: "To compile JavaScript into C++",
            next_question_id: "node_02",
          },
        ],
      },
      {
        _id: "node_03",
        module_id: "mod_node",
        text: "Which command is used to initialize a new Node.js project?",
        options: [
          { _id: "n3_o1", label: "node start", next_question_id: "node_03" },
          {
            _id: "n3_o2",
            label: "npm init",
            next_question_id: "exp_01",
            target_module_id: "mod_express",
          },
        ],
      },
    ]);

    // 3. Create Questions for Express.js (Module Switch 1)
    await Question.create([
      {
        _id: "exp_01",
        module_id: "mod_express",
        is_checkpoint: true,
        text: "What is the correct way to import 'express' in your app?",
        options: [
          {
            _id: "e1_o1",
            label: "const express = require('express');",
            next_question_id: "exp_02",
          },
          {
            _id: "e1_o2",
            label: "npm install express",
            next_question_id: "exp_01",
          },
        ],
      },
      {
        _id: "exp_02",
        module_id: "mod_express",
        text: "Which function is used to serve static files in Express?",
        options: [
          {
            _id: "e2_o1",
            label: "express.static()",
            next_question_id: "exp_03",
          },
          { _id: "e2_o2", label: "app.serve()", next_question_id: "exp_02" },
        ],
      },
      {
        _id: "exp_03",
        module_id: "mod_express",
        text: "In the code 'app.get('/', (req, res) => ...)', what is 'res' used for?",
        options: [
          {
            _id: "e3_o1",
            label: "To read the incoming data",
            next_question_id: "exp_03",
          },
          {
            _id: "e3_o2",
            label: "To send a response to the client",
            next_question_id: "mongo_01",
            target_module_id: "mod_mongodb",
          },
        ],
      },
    ]);

    // 4. Create Questions for MongoDB (Module Switch 2)
    await Question.create([
      {
        _id: "mongo_01",
        module_id: "mod_mongodb",
        is_checkpoint: true,
        text: "What does 'Mongoose' do in a Node.js/MongoDB application?",
        options: [
          {
            _id: "m1_o1",
            label: "It is the database engine itself",
            next_question_id: "mongo_01",
          },
          {
            _id: "m1_o2",
            label: "It provides a schema-based solution for data modeling",
            next_question_id: "mongo_02",
          },
        ],
      },
      {
        _id: "mongo_02",
        module_id: "mod_mongodb",
        text: "Which Mongoose method is used to find a single document by its ID?",
        options: [
          { _id: "m2_o1", label: "findById()", next_question_id: "mongo_03" },
          { _id: "m2_o2", label: "getById()", next_question_id: "mongo_02" },
        ],
      },
      {
        _id: "mongo_03",
        module_id: "mod_mongodb",
        text: "What is a 'Collection' in MongoDB comparable to in SQL databases?",
        options: [
          { _id: "m3_o1", label: "A Row", next_question_id: "mongo_03" },
          { _id: "m3_o2", label: "A Table", next_question_id: "final_end" },
        ],
      },
      {
        _id: "final_end",
        module_id: "mod_mongodb",
        text: "� Master Level Reached! You have cleared all Node, Express, and MongoDB modules. Start building your dream project!",
        options: [],
      },
    ]);

    console.log("Database seeded with Expanded Practice Quiz!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedPracticeQuiz();
