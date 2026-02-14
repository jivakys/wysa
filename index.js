require("dotenv").config();
const express = require("express");
const connection = require("./configs/db");
const authRouter = require("./routes/authRoutes");
const conversationRouter = require("./routes/conversationRoutes");

const app = express();
app.use(express.json());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/conversation", conversationRouter);

app.listen(process.env.PORT, async () => {
  try {
    await connection();
    console.log(`Listening on port ${process.env.PORT}`);
  } catch (error) {
    console.log(error);
  }
});
