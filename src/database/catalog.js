import mongoose from "mongoose";
import dotenv from "dotenv";
import asyncHandler from "../utils/asyncHandler.js";
import { makeLog } from "../utils/logentries.js";
import secerets from "../aws/aws-secerets.js";

dotenv.config({ path: "./.env" });

var MONGO_URI = secerets.MONGO_URI;
const DB_URL = MONGO_URI;

console.log(DB_URL);

async function connectDB() {
  try {
    const conn = await mongoose.connect(DB_URL);
    const { host, port } = conn.connection;
    await makeLog(
      `Database connected successfully at ${host}:${port}`,
      "Database",
      process.env.serverLogs
    );
    if (process.env.enableLogging === "true") {
      console.log("logging is enabled");
      console.log("the .logs folder contains logs");
    } else {
      console.log("logging is disabled");
      console.log("check terminal for logs");
    }
    return conn;
  } catch (err) {
    console.error("Database connection error:", err);
    throw new Error("Database connection failed");
  }
}

export { connectDB };