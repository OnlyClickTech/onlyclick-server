const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
var database = "not connected";
const { connectDB } = require("./src/database/catalog.js");

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);


connectDB()
  .then(() => {
    console.log("Connected to MongoDB");
    database = "connected";
  })
  .catch((err) => {
    console.error(`MongoDB connection error: ${err}`);
  });

app.get("/", (req, res) => {
  res.json("server" + database);
});


const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});