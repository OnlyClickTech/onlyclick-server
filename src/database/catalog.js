import mongoose from "mongoose";
import dotenv from "dotenv";
import asyncHandler from "../utils/asyncHandler.js";
import { makeLog } from "../utils/logentries.js";
//import getSecret from "../aws/aws-secerets.js";

dotenv.config({ path: "./.env" });
/*
const MONGO_URI = await getSecret("onlyclick-server").then((secrets) => {
    MONGO_URI = secrets.MONGO_URI;
}).catch((error) => console.log(error));
*/
const DB_URL = process.env.MONGO_URI || MONGO_URI;

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