import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();

import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import transactionRoute from "./routes/transaction.route.js";
import notificationRoute from "./routes/notification.route.js";
import adminRoute from "./routes/admin.route.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/transaction", transactionRoute);
app.use("/api/notification", notificationRoute);
app.use("/api/admin", adminRoute);

app.get("/", (req, res) => res.json({ message: "E-Wallet API Running" }));

export default app;
