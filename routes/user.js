import express from "express";
import { check, validationResult } from "express-validator";

import pkg from "bcryptjs";
const { hash, genSalt } = pkg;

import config from "config";
import jwt from "jsonwebtoken";

import User from "../models/User.js";

const UserRouter = express.Router();

// @route       POST api/user
// @desc        Create user
// @access      Public
UserRouter.post(
  "/",
  [
    check("username", "Username needs to be a valid email").isEmail(),
    check("password", "Please enter a password with at least 6 characters").isLength({ min: 6 }),
  ],
  async (req, res) => {
    // Data Validation
    console.log("Received request");
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password, watchlist } = req.body;

    try {
      let user = await User.findOne({ username });

      if (user) {
        return res.status(400).json({ msg: "User already exists" });
      }

      user = new User({ username, password, watchlist });

      const salt = await genSalt(10);

      user.password = await hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
        if (err) throw err;
        res.json({ id: user.id, token });
      });
    } catch (error) {
      console.error(error.message);
      return res.status(500).json("Server Error");
    }
  }
);

// @route       GET api/user/:userId
// @desc        Read user
// @access      Admin
UserRouter.get("/", async (req, res) => {
  // 18 - 664837282d2fb889cae6c318
  const users = await User.find();
  console.log(users);
  res.json(users);
});

// @route       PUT api/user
// @desc        Update user
// @access      Private
UserRouter.put("/:userId", async (req, res) => {
  console.log(req.body);
  const { _id, watchlist } = req.body;
  let doc = await User.findOneAndUpdate({ _id: _id }, { watchlist: watchlist }, null);
  console.log(doc);
  res.json({ msg: "Document updated" });
});

// @route       DELETE api/user
// @desc        Delete user
// @access      Admin
UserRouter.delete("/:userId", async (req, res) => {
  let userId = req.params.userId;
  const response = await User.deleteOne({ _id: userId });
  console.log(response);
  res.json(response);
});

export default UserRouter;

// {
//     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjY0ODM3MjgyZDJmYjg4OWNhZTZjMzE4In0sImlhdCI6MTcxNjAwODc0NSwiZXhwIjoxNzE2MDEyMzQ1fQ.yiNx0fFsyqGBB59SHJY6xYbqDMu2LFrCYqK9oRRj5Xk"
// }

// 664837282d2fb889cae6c318
