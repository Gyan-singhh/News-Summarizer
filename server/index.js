import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { errorMiddleware } from "./middleware/error.middleware.js";
import connectDB from "./db/dbConnect.js";
import userRouter from "./routes/user.route.js";
import chatRouter from "./routes/chat.route.js";
import newsRouter from "./routes/news.route.js";
import cookieParser from "cookie-parser";
import summaryRouter from "./routes/summary.route.js";
import uploadRouter from "./routes/upload.route.js";
import ImageKit from "imagekit";

dotenv.config({
  path: "./.env",
});

export const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
export const imagekit = new ImageKit({
  urlEndpoint: process.env.IMAGE_KIT_ENDPOINT,
  publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
});

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
  })
);

app.use("/api/user", userRouter);
app.use("/api/chats", chatRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/news", newsRouter);
app.use("/api/summarize-link", summaryRouter);

connectDB();

app.use(errorMiddleware);
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Gateway running at http://localhost:${PORT}`);
});
