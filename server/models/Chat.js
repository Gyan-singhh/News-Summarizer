import mongoose from "mongoose";
import { User } from "./User.js";

const chatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    history: [
      {
        role: {
          type: String,
          enum: ["user", "model"],
          required: true,
        },
        text: {
          type: String,
          required: true,
        },
        img: {
          type: String,
          required: false,
        },
      },
    ],
  },
  { timestamps: true }
);

export const Chat = mongoose.models.Chat || mongoose.model("Chat", chatSchema);
