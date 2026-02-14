const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const signup = async (req, res) => {
  try {
    const { username, password } = req.body;

    let existingUser = await User.findOne({ username });
    if (existingUser) {
      return res
        .status(400)
        .send({ error: "User already registered in Database" });
    }

    // We let the User model's pre-save hook handle the hashing to avoid double-hashing
    let user = new User({ username, password });
    await user.save();

    res.status(200).send({
      message: "User Registered now",
      user: { id: user._id, username: user.username },
    });
  } catch (error) {
    res.status(400).send({ error: error.message });
    console.log(error);
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    let user = await User.findOne({ username }).select("+password");

    if (!user) {
      return res
        .status(400)
        .send({ error: "User not found here, please register", OK: false });
    }

    const isMatch = await user.matchPassword(password);

    if (isMatch) {
      const token = jwt.sign(
        { userID: user._id },
        process.env.SECRET_KEY || "dev_secret_key_123",
        { expiresIn: "7d" },
      );

      res.status(200).send({
        message: "Now user Logged In",
        token,
        user: { id: user._id, username: user.username },
        OK: true,
      });
    } else {
      res.status(401).send({
        error: "Incorrect Password, Kindly Login Again",
        OK: false,
      });
    }
  } catch (error) {
    res.status(400).send({
      message: "Something went wrong",
      error: error.message,
      OK: false,
    });
    console.log(error);
  }
};

module.exports = { signup, login };
