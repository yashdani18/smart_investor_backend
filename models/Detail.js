import mongoose from "mongoose";

const DetailsSchema = mongoose.Schema({
  ticker: {
    type: String,
  },
  company_name: {
    type: String,
  },
  price: {
    type: Number,
  },
  change: {
    type: Number,
  },
  mcap: {
    type: Number,
  },
  current_price: {
    type: Number,
  },
  high: {
    type: Number,
  },
  low: {
    type: Number,
  },
  stock_pe: {
    type: Number,
  },
  book_value: {
    type: Number,
  },
  dividend_yield: {
    type: Number,
  },
  roce: {
    type: Number,
  },
  roe: {
    type: Number,
  },
  fv: {
    type: Number,
  },
  quarterlyData: {
    type: Object,
  },
  annualData: {
    type: Object,
  },
});

export default mongoose.model("col_details", DetailsSchema);
