import { useEffect, useRef, useState } from "react";
import Upload from "./Upload.jsx";
import { model } from "../../services/gemini.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateChat } from "../../services/api.js";
import { FaPaperPlane, FaRobot, FaTimes } from "react-icons/fa";

const NewPrompt = ({ data }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [img, setImg] = useState({
    isLoading: false,
    error: "",
    dbData: null,
    aiData: null,
  });

  const getChatHistory = () => {
    if (!data?.data?.history) return [];

    return data.data.history
      .filter((item) => item.role && item.text && item.text.trim() !== "")
      .map(({ role, text }) => ({
        role: role === "model" ? "model" : "user",
        parts: [{ text }],
      }));
  };

  const chat = model.startChat({
    history: getChatHistory(),
  });

  const endRef = useRef(null);
  const formRef = useRef(null);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => {
      if (!answer || answer.trim() === "") {
        console.log("Skipping mutation - empty answer");
        return Promise.resolve();
      }
      console.log("Image data:", img.dbData);
      console.log("File path:", img.dbData?.filePath);

      return updateChat(data.data._id, {
        question: question && question.trim() !== "" ? question : undefined,
        answer: answer.trim(),
        img: img.dbData?.filePath || undefined,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat", data.data._id] });
      setImg({ isLoading: false, error: "", dbData: null, aiData: null });
      setQuestion("");
    },
    onError: (err) => {
      console.error("Mutation error:", err);
    },
  });

  const add = async (text, isInitial) => {
    if (!isInitial) {
      setQuestion(text);
    }

    setIsTyping(true);
    setAnswer("");

    try {
      if (!text && !img.aiData) {
        console.error("No text or image provided");
        setIsTyping(false);
        return;
      }

      let result;
      if (img.aiData) {
        const prompt = text || "What's in this image?";
        result = await chat.sendMessageStream([img.aiData, prompt]);
      } else {
        result = await chat.sendMessageStream(text);
      }

      let accumulatedText = "";
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        accumulatedText += chunkText;
        setAnswer(accumulatedText);
      }

      setTimeout(() => {
        mutation.mutate();
        setIsTyping(false);
        if (formRef.current) {
          formRef.current.reset();
        }
        setQuestion("");
      }, 500);
    } catch (err) {
      console.error("Error in add function:", err);
      setIsTyping(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const text = e.target.text.value;

    if (!text && !img.aiData) return;

    add(text, false);
    setInputValue("");
  };

  const handleRemoveImage = () => {
    setImg({ isLoading: false, error: "", dbData: null, aiData: null });
  };

  const hasRun = useRef(false);

  useEffect(() => {
    if (!hasRun.current && data?.data?.history?.length === 1) {
      const firstMessage = data.data.history[0];
      if (
        firstMessage.role === "user" &&
        firstMessage.text &&
        firstMessage.text.trim() !== ""
      ) {
        add(firstMessage.text, true);
      }
    }
    hasRun.current = true;
  }, [data]);

  return (
    <>
      {isTyping && !answer && (
        <div className="flex items-start gap-3 md:gap-4 max-w-4xl mx-auto mb-4 md:mb-6 px-2">
          <div className="w-6 h-6 md:w-8 md:h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
            <FaRobot className="w-3 h-3 md:w-4 md:h-4 text-white" />
          </div>
          <div className="bg-gray-800/50 border border-gray-700 p-3 md:p-4 rounded-2xl max-w-xs sm:max-w-sm md:max-w-2xl">
            <div className="flex items-center gap-3 text-gray-400">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
              <span className="text-sm">OrbitAI is typing...</span>
            </div>
          </div>
          <div className="flex-1" />
        </div>
      )}

      {img.dbData && (
        <div className="max-w-4xl mx-auto mb-4 px-4">
          <div className="relative inline-block">
            <img
              src={img.dbData.url}
              alt="Uploaded preview"
              className="max-w-xs rounded-lg border border-gray-600"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            >
              <FaTimes className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      <div ref={endRef} className="" />

      <div className="sticky bottom-0 bg-transparent backdrop-blur-sm pb-1">
        <div className="max-w-4xl mx-auto px-4">
          <form
            onSubmit={handleSubmit}
            ref={formRef}
            className="flex items-center gap-2 bg-gray-800/55 border border-gray-600 rounded-2xl px-4 py-1 shadow-[0_0_10px_rgba(0,0,0,0.25)] focus-within:shadow-[0_0_20px_rgba(0,0,0,0.4)] transition-all duration-200"
          >
            <Upload setImg={setImg} />

            <input
              type="text"
              name="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={
                img.aiData ? "Ask about this image..." : "Ask OrbitAI..."
              }
              className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none px-2 py-2 text-sm md:text-base"
              disabled={isTyping}
            />

            <button
              type="submit"
              disabled={isTyping || (!img.aiData && !inputValue)}
              className={`p-2 rounded-xl transition-all duration-200 ${
                isTyping || (!img.aiData && !formRef.current?.text.value)
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-[#565869]/60 active:scale-95"
              } text-green-400`}
            >
              <FaPaperPlane className="w-5 h-5" />
            </button>
          </form>

          <div className="text-center mt-1">
            <span className="text-xs text-gray-500">
              OrbitAI can make mistakes. Consider checking important
              information.
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewPrompt;
