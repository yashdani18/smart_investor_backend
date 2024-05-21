import express from "express";
import User from "../models/User.js";

const ProfileRouter = express.Router();

ProfileRouter.get("/", (req, res) => {
  console.log(req.headers);
  res.send("data");
});

ProfileRouter.post("/", async (req, res) => {
  console.log(req.body);
  const { _id, watchlist } = req.body;
  let doc = await User.findOneAndUpdate({ _id: _id }, { watchlist: watchlist }, null);
  console.log(doc);
  res.send("Document updated (hopefully)");
});

export default ProfileRouter;

/**
 * How does the profile section look like for a new user?
 * 2 sections:
 * Your watchlist:
 *
 * Available tickers:
 *
 * User can click on any of the available tickers,
 * and it will be grayed out,
 * and a new entry would be added to your watchlist
 */
