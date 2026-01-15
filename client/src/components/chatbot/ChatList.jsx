import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getChats, updateChatTitle, deleteChat } from "../../services/api.js";
import { FaPlus, FaTimes, FaEdit, FaTrash, FaRobot } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import Logo from "../Logo.jsx";

const ChatList = () => {
  const queryClient = useQueryClient();
  const [editingChat, setEditingChat] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const navigate = useNavigate();
  const currentChatId = location.pathname.split("/").pop();
  const { user } = useAuth();

  const { isPending, error, data } = useQuery({
    queryKey: ["userChats"],
    queryFn: getChats,
  });

  const updateTitleMutation = useMutation({
    mutationFn: ({ chatId, title }) => updateChatTitle(chatId, title),
    onSuccess: () => {
      queryClient.invalidateQueries(["userChats"]);
      setEditingChat(null);
      setEditTitle("");
    },
  });

  const deleteChatMutation = useMutation({
    mutationFn: (chatId) => deleteChat(chatId),
    onSuccess: () => {
      navigate("/chats");
      queryClient.invalidateQueries(["userChats"]);
    },
  });

  const handleEditClick = (chat) => {
    setEditingChat(chat._id);
    setEditTitle(chat.title);
  };

  const handleTitleSave = (chatId) => {
    if (editTitle.trim() === "") return;
    updateTitleMutation.mutate({ chatId, title: editTitle.trim() });
  };

  const handleDeleteChat = (chatId, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this chat?")) {
      deleteChatMutation.mutate(chatId);
    }
  };

  const handleKeyPress = (e, chatId) => {
    if (e.key === "Enter") {
      handleTitleSave(chatId);
    } else if (e.key === "Escape") {
      setEditingChat(null);
      setEditTitle("");
    }
  };

  return (
    <div className="w-full md:w-80 bg-gray-900 p-4 border-r border-gray-700 h-screen flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <Logo h={9} w={9} className={"ml-1"} />

        <button className="md:hidden p-2 text-gray-400 hover:text-white">
          <FaTimes className="w-5 h-5" />
        </button>
      </div>

      <Link
        to="/chats"
        className="flex items-center gap-3 p-3 mb-4 text-white bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-600 transition-all duration-200 hover:border-green-500/50 group"
      >
        <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center group-hover:bg-green-700 transition-colors">
          <FaPlus className="w-4 h-4 text-white" />
        </div>
        <span className="font-medium">New chat</span>
      </Link>

      <div className="mb-4">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2">
          Recent chats
        </span>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {isPending ? (
          <div className="flex justify-center py-4">
            <div className="text-gray-500 text-sm">Loading...</div>
          </div>
        ) : error ? (
          <div className="flex justify-center py-4">
            <div className="text-red-400 text-sm">Something went wrong!</div>
          </div>
        ) : data?.data?.length > 0 ? (
          data.data.map((chat) => {
            const isActive = chat._id === currentChatId;
            return (
              <Link
                to={`/chats/${chat._id}`}
                key={chat._id}
                className={`group relative flex items-center gap-3 p-3 rounded-lg mb-1 transition-all duration-200 border ${
                  isActive
                    ? "bg-gray-700/50 border-gray-600 text-white"
                    : "text-gray-300 hover:bg-gray-800 border-transparent hover:border-gray-600"
                }`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    className={`w-6 h-6 rounded flex items-center justify-center flex-shrink-0 bg-purple-600`}
                  >
                    <FaRobot className="w-3 h-3 text-white" />
                  </div>

                  {editingChat === chat._id ? (
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onBlur={() => handleTitleSave(chat._id)}
                      onKeyDown={(e) => handleKeyPress(e, chat._id)}
                      className="flex-1 bg-transparent border-gray-500 focus:outline-none text-sm text-white"
                      autoFocus
                    />
                  ) : (
                    <span className="text-sm truncate flex-1 group-hover:text-white transition-colors">
                      {chat.title}
                    </span>
                  )}
                </div>

                <div
                  className={`flex items-center gap-1 transition-opacity ${
                    isActive
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100"
                  }`}
                  onClick={(e) => e.preventDefault()} // prevent link navigation when clicking icons
                >
                  {editingChat !== chat._id && (
                    <>
                      <button
                        onClick={() => handleEditClick(chat)}
                        className="p-1 text-gray-400 hover:text-blue-400 transition-colors"
                        title="Edit title"
                      >
                        <FaEdit className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteChat(chat._id, e)}
                        className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                        title="Delete chat"
                      >
                        <FaTrash className="w-3 h-3" />
                      </button>
                    </>
                  )}
                </div>
              </Link>
            );
          })
        ) : (
          <div className="text-center py-8 text-gray-500 text-sm">
            No recent chats
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-700">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer">
          <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
            {user?.username?.charAt(0)?.toUpperCase()}
          </div>
          <span className="text-sm text-gray-300 truncate">
            {user?.username}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatList;
