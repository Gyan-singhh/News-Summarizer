import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const summarizeText = async (url, title = "") => {
  try {
    const response = await API.post("/summarize-link", { url, title });
    return response.data;
  } catch (error) {
    console.error("Error summarizing text:", error);
    throw error;
  }
};

export const fetchNews = async ({ q, category }) => {
  return API.get("/news", {
    params: { q, category },
  });
};

export const signup = async (payload) => {
  const response = await API.post("/user/signup", payload);
  return response.data.data;
};

export const login = async (payload) => {
  const response = await API.post("/user/login", payload);
  return response.data.data;
};

export const logout = async () => {
  const response = await API.get("/user/logout");
  return response.data;
};

export const getUser = async () => {
  const response = await API.get("/user/me");
  return response.data;
};

export const getChats = async () => {
  const response = await API.get("/chats");
  return response.data;
};

export const getChat = async (chatId) => {
  const response = await API.get(`/chats/${chatId}`);
  return response.data;
};

export const createChat = async (payload) => {
  const response = await API.post("/chats", payload);
  return response.data;
};

export const updateChat = async (chatId, payload) => {
  const response = await API.put(`/chats/${chatId}`, payload);
  return response.data;
};

export const updateChatTitle = async (chatId, title) => {
  const response = await API.patch(`/chats/${chatId}/title`, { title });
  return response.data;
};

export const deleteChat = async (chatId) => {
  const response = await API.delete(`/chats/${chatId}`);
  return response.data;
};
