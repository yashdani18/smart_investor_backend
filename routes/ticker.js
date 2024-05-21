import express from "express";
import Ticker from "../models/Ticker.js";

const TickerRouter = express.Router();

TickerRouter.get("/", async (req, res) => {
  const tickers = await Ticker.find({});
  res.json(tickers);
});

export default TickerRouter;
