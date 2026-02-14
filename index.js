const express = require("express");
require("dotenv").config();
const { connection } = require("./configs/db");
const app = express();

app.use(express.json());

app.listen(process.env.PORT, async () => {
  try {
    await connection;
    console.log(`Listening on port ${process.env.PORT}`);
  } catch (error) {
    console.log(error);
  }
});
