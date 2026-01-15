import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import Home from "./pages/Home";
import Article from "./pages/Article";
import AuthPage from "./pages/AuthPage";
import About from "./pages/About";
import { AuthProvider } from "./context/AuthContext";
import AuthLayout from "./pages/AuthLayout";
import ChatPage from "./components/chatbot/ChatPage.jsx";
import DashboardPage from "./components/chatbot/DashboardPage";
import DashboardLayout from "./components/chatbot/DashboardLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      {
        path: "article",
        element: (
          <AuthLayout authentication={true}>
            <Article />
          </AuthLayout>
        ),
      },
      {
        path: "auth",
        element: (
          <AuthLayout authentication={false}>
            <AuthPage />
          </AuthLayout>
        ),
      },
      { path: "about", element: <About /> },
    ],
  },
  {
    element: (
      <AuthLayout authentication={true}>
        <DashboardLayout />
      </AuthLayout>
    ),
    children: [
      { path: "/chats", element: <DashboardPage /> },
      { path: "/chats/:id", element: <ChatPage /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
