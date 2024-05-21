import express from "express";
import { check, validationResult } from "express-validator";

import pkg from "bcryptjs";
const { hash, genSalt } = pkg;

import config from "config";
import jwt from "jsonwebtoken";

import User from "../models/User.js";

const UsersRouter = express.Router();

// @route       POST api/users
// @desc        Register a user
// @access      Public
UsersRouter.post(
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
      /**
       * Check if user with posted username exists in the database
       * If yes, return 400 status to the user
       * Else, encrypt password, and save user to database
       * Respond to user with JWT token
       */
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

      //   jwt.sign(payload, config.get("jwtSecret"), { expiresIn: 3600 }, (err, token) => {
      //     if (err) throw err;
      //     res.json({ token });
      //   });

      jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    } catch (error) {
      console.error(error.message);
      return res.status(500).json("Server Error");
    }
  }
);

export default UsersRouter;

// {
//     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjY0ODM3MjgyZDJmYjg4OWNhZTZjMzE4In0sImlhdCI6MTcxNjAwODc0NSwiZXhwIjoxNzE2MDEyMzQ1fQ.yiNx0fFsyqGBB59SHJY6xYbqDMu2LFrCYqK9oRRj5Xk"
// }

// 664837282d2fb889cae6c318
