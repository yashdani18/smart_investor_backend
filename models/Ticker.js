import mongoose from "mongoose";

const TickerSchema = mongoose.Schema({
  ticker: {
    type: String,
    required: true,
  },
});

export default mongoose.model("col_tickers", TickerSchema);
