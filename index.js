import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { connectDB } from "./src/database/catalog.js";
//import getSecret from "./src/aws/aws-secerets.js";
import authRoutes from "./src/routes/auth.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import bookingRoutes from "./src/routes/booking.routes.js";
import serviceRoutes from "./src/routes/service.routes.js";
import reviewRoutes from "./src/routes/review.routes.js";
dotenv.config({ path: "../.env" });

const app = express();

let MONGO_URI;
let PORT;

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

app.use('/api/auth', authRoutes);
app.use("/api/user" , userRoutes);
app.use("/api/booking" , bookingRoutes);
app.use("/api/service" , serviceRoutes);
app.use("/api/review" , reviewRoutes);
//getSecret("onlyclick-server")
//  .then((secrets) => {
//    PORT = secrets.PORT;
//  })
//  .catch(console.error);

connectDB()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error(`MongoDB connection error: ${err}`);
  });

app.get("/", (req, res) => {
  res.json("server");
});

PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});