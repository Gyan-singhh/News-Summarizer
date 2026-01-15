import mongoose from "mongoose";
import { Chat } from "./Chat.js";
import { User } from "./User.js";

const userChatsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    chats: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Chat",
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

export const UserChats =
  mongoose.models.UserChats || mongoose.model("UserChats", userChatsSchema);
