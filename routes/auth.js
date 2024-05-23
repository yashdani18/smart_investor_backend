import express from "express";
import User from "../models/User.js";
import pkg from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "config";
import { check, validationResult } from "express-validator";
const { compare } = pkg;
const AuthRouter = express.Router();

// @route       GET api/auth
// @desc        Get logged in user
// @access      Private
AuthRouter.get("/", async (req, res) => {
  const token = req.headers["x-auth-token"];
  console.log("Token:" + token);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    let user = await User.findOne({ _id: decoded.user.id });

    let object = {
      _id: user._id,
      watchlist: user.watchlist,
    };
    res.json({ object });
  } catch (err) {
    return res.status(403).json({ msg: "Invalid token" });
  }
});

// @route       POST api/auth
// @desc        Auth user & get token
// @access      Public
AuthRouter.post(
  "/",
  [check("username", "Please enter a valid email").isEmail(), check("password", "Please enter a password").exists()],
  async (req, res) => {
    console.log("Received request");
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    console.log(req.body);
    const { username, password } = req.body;

    try {
      let user = await User.findOne({ username });

      if (!user) {
        return res.status(403).json({ msg: "Invalid credentials" });
      }

      const isMatch = await compare(password, user.password);

      if (!isMatch) {
        return res.status(403).json({ msg: "Invalid credentials" });
      } else {
        console.log("Passwords match");
        const payload = {
          user: {
            id: user.id,
          },
        };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
          if (err) throw err;
          res.json({ token });
        });
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
    }
  }
);

export default AuthRouter;
