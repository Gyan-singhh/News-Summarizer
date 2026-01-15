import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createChat } from "../../services/api.js";
import { FaRobot, FaImage, FaCode, FaPaperPlane } from "react-icons/fa";

const DashboardPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (text) => createChat({ text }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["userChats"] });
      navigate(`/chats/${data.data.chatId}`);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.text.value;
    if (!text) return;

    mutation.mutate(text);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4 md:p-8 min-h-screen">
      <div className="text-center mb-8 md:mb-12 w-full max-w-6xl">
        <div className="flex items-center justify-center gap-3 mb-4 md:mb-6">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-2 md:p-3 rounded-full shadow-lg">
            <FaRobot className="w-6 h-6 md:w-8 md:h-8 text-white" />
          </div>
          <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            OrbitAI
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
          <div className="bg-gray-800 p-4 md:p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-700 hover:border-green-500/30 hover:scale-105">
            <div className="bg-green-900/30 p-2 md:p-3 rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center mb-3 md:mb-4 mx-auto">
              <FaRobot className="w-4 h-4 md:w-6 md:h-6 text-green-400" />
            </div>
            <span className="font-semibold text-gray-200 text-sm md:text-base">
              Create a New Chat
            </span>
          </div>

          <div className="bg-gray-800 p-4 md:p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-700 hover:border-blue-500/30 hover:scale-105">
            <div className="bg-blue-900/30 p-2 md:p-3 rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center mb-3 md:mb-4 mx-auto">
              <FaImage className="w-4 h-4 md:w-6 md:h-6 text-blue-400" />
            </div>
            <span className="font-semibold text-gray-200 text-sm md:text-base">
              Analyze Images
            </span>
          </div>

          <div className="bg-gray-800 p-4 md:p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-700 hover:border-purple-500/30 hover:scale-105">
            <div className="bg-purple-900/30 p-2 md:p-3 rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center mb-3 md:mb-4 mx-auto">
              <FaCode className="w-4 h-4 md:w-6 md:h-6 text-purple-400" />
            </div>
            <span className="font-semibold text-gray-200 text-sm md:text-base">
              Help me with my Code
            </span>
          </div>
        </div>
      </div>

      <div className="w-full max-w-2xl px-4">
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            name="text"
            placeholder="Ask OrbitAI..."
            className="w-full px-4 md:px-6 py-3 md:py-4 pr-14 md:pr-16 rounded-xl border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent shadow-lg text-sm md:text-base"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-600 hover:bg-green-700 text-white p-2 md:p-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-green-500/25"
          >
            <FaPaperPlane className="w-3 h-3 md:w-4 md:h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default DashboardPage;