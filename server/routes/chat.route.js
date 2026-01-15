import express from "express";
import { Chat } from "../models/Chat.js";
import { UserChats } from "../models/UserChats.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post(
  "/",
  isAuthenticated,
  asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const { text } = req.body;

    if (!userId) throw new ApiError(401, "Unauthorized");
    if (!text) throw new ApiError(400, "Text is required");

    const newChat = new Chat({
      userId,
      history: [
        {
          role: "user",
          text: text || "",
        },
      ],
    });

    const savedChat = await newChat.save();

    const userChats = await UserChats.findOne({ userId });

    const title = text ? text.substring(0, 40) : "New Chat";

    if (!userChats) {
      const newUserChats = new UserChats({
        userId,
        chats: [
          {
            _id: savedChat._id,
            title,
          },
        ],
      });
      await newUserChats.save();
    } else {
      await UserChats.updateOne(
        { userId },
        {
          $push: {
            chats: {
              _id: savedChat._id,
              title,
              createdAt: new Date(),
            },
          },
        }
      );
    }

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { chatId: savedChat._id },
          "Chat created successfully"
        )
      );
  })
);

router.get(
  "/",
  isAuthenticated,
  asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    if (!userId) throw new ApiError(401, "Unauthorized");

    const userChats = await UserChats.findOne({ userId });
    if (!userChats || !userChats.chats.length)
      throw new ApiError(404, "No chats found for this user");

    const sortedChats = [...userChats.chats].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    return res
      .status(200)
      .json(
        new ApiResponse(200, sortedChats, "User chats fetched successfully")
      );
  })
);

router.get(
  "/:id",
  isAuthenticated,
  asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const { id } = req.params;

    if (!userId) throw new ApiError(401, "Unauthorized");

    const chat = await Chat.findOne({ _id: id, userId });
    if (!chat) throw new ApiError(404, "Chat not found");

    return res
      .status(200)
      .json(new ApiResponse(200, chat, "Chat fetched successfully"));
  })
);

router.put(
  "/:id",
  isAuthenticated,
  asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const { id } = req.params;
    const { question, answer, img } = req.body;

    if (!userId) throw new ApiError(401, "Unauthorized");

    if (
      (!question || question.trim() === "") &&
      !img &&
      (!answer || answer.trim() === "")
    ) {
      throw new ApiError(400, "Question, image, or answer is required");
    }

    const newItems = [
      ...((question && question.trim() !== "") || img
        ? [
            {
              role: "user",
              text: question || "Image",
              ...(img && { img }),
            },
          ]
        : []),
      ...(answer && answer.trim() !== ""
        ? [
            {
              role: "model",
              text: answer,
            },
          ]
        : []),
    ];

   

    if (newItems.length === 0) {
      throw new ApiError(400, "No valid content to add to chat");
    }

    const updatedChat = await Chat.updateOne(
      { _id: id, userId },
      { $push: { history: { $each: newItems } } }
    );

    if (!updatedChat.modifiedCount)
      throw new ApiError(404, "Chat not found or not updated");

    return res
      .status(200)
      .json(new ApiResponse(200, updatedChat, "Chat updated successfully"));
  })
);

router.patch(
  "/:id/title",
  isAuthenticated,
  asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const { id } = req.params;
    const { title } = req.body;

    if (!userId) throw new ApiError(401, "Unauthorized");
    if (!title || title.trim() === "") {
      throw new ApiError(400, "Title is required");
    }

    const updatedUserChats = await UserChats.updateOne(
      { userId, "chats._id": id },
      { $set: { "chats.$.title": title.trim() } }
    );

    if (!updatedUserChats.modifiedCount) {
      throw new ApiError(404, "Chat not found or not updated");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Chat title updated successfully"));
  })
);

router.delete(
  "/:id",
  isAuthenticated,
  asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const { id } = req.params;
    if (!userId) throw new ApiError(401, "Unauthorized");

    const deletedChat = await Chat.deleteOne({ _id: id, userId });
    if (!deletedChat.deletedCount) throw new ApiError(404, "Chat not found");

    const updatedUserChats = await UserChats.updateOne(
      { userId },
      { $pull: { chats: { _id: id } } }
    );
    if (!updatedUserChats.modifiedCount)
      throw new ApiError(404, "Chat not found in user chats");

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Chat deleted successfully"));
  })
);

export default router;
