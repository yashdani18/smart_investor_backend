import mongoose from "mongoose";
import config from "config";
const mongoURL = config.get("mongoURL");

mongoose.set("strictQuery", true);

export const connectDB = async () => {
  console.log("inConnectDB");
  mongoose
    .connect(mongoURL, { dbName: "smart_investor" })
    .then(() => console.log("MongoDB connected!"))
    .catch((err) => {
      console.log(err.message);
      process.exit(1);
    });
};
