import express from "express";
import Detail from "../models/Detail.js";

const DetailRouter = express.Router();

DetailRouter.get("/", async (req, res) => {
  let details = await Detail.find({});
  res.json({ details });
});

DetailRouter.get("/:ticker", async (req, res) => {
  console.log(req.params.ticker);
  const ticker = req.params.ticker;
  let detail = await Detail.findOne({ ticker });
  if (detail) {
    return res.json(detail);
  }

  res.status(400).json({ msg: "Invalid Ticker" });
});

export default DetailRouter;
