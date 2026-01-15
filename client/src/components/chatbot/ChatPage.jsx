import NewPrompt from "./NewPrompt.jsx";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import Markdown from "react-markdown";
import { getChat } from "../../services/api.js";
import {
  FaUser,
  FaRobot,
  FaBars,
  FaCrown,
  FaCompass,
  FaEnvelope,
} from "react-icons/fa";
import { useEffect, useRef, useState } from "react";

const ChatPage = () => {
  const path = useLocation().pathname;
  const chatId = path.split("/").pop();
  const endRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { isPending, error, data } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: () => getChat(chatId),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    const scrollToBottom = () => {
      if (endRef.current) {
        endRef.current.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    };

    scrollToBottom();
  }, [data?.data?.history]);

  return (
    <div className="flex-1 flex flex-col h-screen">
      <nav className="bg-gray-900/80 backdrop-blur-md border-b border-gray-700/50 z-10">
        <div className="px-4 md:px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                className="md:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <FaBars className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-bold  bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                OrbitAI
              </h1>
            </div>

            <div className="hidden md:flex items-center gap-6">
              <button className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                <FaCompass className="w-4 h-4" />
                <span>Explore</span>
              </button>
              <button className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                <FaCrown className="w-4 h-4" />
                <span>Upgrade</span>
              </button>
              <button className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                <FaEnvelope className="w-4 h-4" />
                <span>Contact</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <FaUser className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-1 overflow-hidden flex flex-col bg-gradient-to-br from-gray-900/40 to-gray-800/40 backdrop-blur-sm">
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-3 md:p-4 space-y-4 md:space-y-6 scrollbar-hide"
        >
          {!isPending &&
            !error &&
            (!data?.data?.history || data.data.history.length === 0) && (
              <div className="flex flex-col items-center justify-center h-full text-center px-4 py-8">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-600/80 to-blue-600/80 rounded-full flex items-center justify-center mb-6 backdrop-blur-sm">
                  <FaRobot className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold  mb-3 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Your AI
                </h2>
                <p className="text-gray-300 max-w-md text-lg">
                  Start a conversation and explore what I can do for you. Ask me
                  anything!
                </p>
              </div>
            )}

          {isPending ? (
            <div className="flex justify-center items-center h-20">
              <div className="text-gray-400">Loading chat...</div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-20">
              <div className="text-red-400">Something went wrong!</div>
            </div>
          ) : (
            data?.data?.history?.map((message, i) => (
              <div
                key={i}
                className="flex items-start gap-3 md:gap-4 max-w-4xl mx-auto px-2"
              >
                {message.role === "user" ? (
                  <>
                    <div className="flex-1" />
                    <div className="bg-green-600/20 border border-green-500/30 p-3 md:px-3 rounded-2xl max-w-xs sm:max-w-sm md:max-w-2xl backdrop-blur-sm">
                     
                      {message.img && (
                        <div className="mb-3">
                          <img
                            src={`${import.meta.env.VITE_IMAGE_KIT_ENDPOINT}/${
                              message.img
                            }`}
                            alt="Uploaded by user"
                            className="max-w-full max-h-64 rounded-lg border border-gray-600"
                          />
                        </div>
                      )}
                      <div className="text-gray-100 whitespace-pre-wrap text-sm md:text-base">
                        <Markdown>{message.text}</Markdown>
                      </div>
                    </div>
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                      <FaUser className="w-3 h-3 md:w-4 md:h-4 text-white" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                      <FaRobot className="w-3 h-3 md:w-4 md:h-4 text-white" />
                    </div>
                    <div className="bg-gray-800/30 border border-gray-700/50 p-3 md:p-4 rounded-2xl max-w-xs sm:max-w-sm md:max-w-2xl backdrop-blur-sm">
                      <div className="text-gray-100 whitespace-pre-wrap text-sm md:text-base prose prose-invert max-w-none">
                        <Markdown>{message.text}</Markdown>
                      </div>
                    </div>
                    <div className="flex-1" />
                  </>
                )}
              </div>
            ))
          )}
          <div ref={endRef} className="h-[1px]" />
        </div>

        {data && <NewPrompt data={data} />}
      </div>
    </div>
  );
};

export default ChatPage;
