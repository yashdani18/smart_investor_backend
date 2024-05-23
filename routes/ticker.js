import express from "express";
import Ticker from "../models/Ticker.js";

const TickerRouter = express.Router();

TickerRouter.get("/", async (req, res) => {
  const tickers = await Ticker.find({});
  res.json(tickers);
});

TickerRouter.get("/:ticker", async (req, res) => {
  const ticker = req.params.ticker;
  const tickers = await Ticker.findOne({ ticker });
  res.json(tickers);
});

export default TickerRouter;
