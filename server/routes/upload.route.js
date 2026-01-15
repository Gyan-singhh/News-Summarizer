import express from "express";
import { imagekit } from "../index.js";
const router = express.Router();

router.get("/", (req, res) => {
  const result = imagekit.getAuthenticationParameters();
  res.send(result);
});

export default router;
