import { Link } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import { useState } from "react";
import { FaRobot, FaCrown, FaShieldAlt, FaFileContract } from "react-icons/fa";

const HomePage = () => {
  const [typingStatus, setTypingStatus] = useState("human1");

  const getAvatarIcon = (status) => {
    if (status === "bot") {
      return <FaRobot className="w-8 h-8 text-blue-500" />;
    }
    return (
      <div
        className={`w-8 h-8 rounded-full ${
          status === "human1" ? "bg-green-500" : "bg-purple-500"
        }`}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 rounded-full opacity-10 blur-3xl"></div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between min-h-[80vh]">
          <div className="lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0">
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              OrbitAI
            </h1>
            <h2 className="text-2xl font-semibold mb-4 text-blue-200">
              Supercharge your creativity and productivity
            </h2>
            <h3 className="text-lg text-gray-300 mb-8 max-w-md">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Placeat
              sint dolorem doloribus, architecto dolor.
            </h3>
            <Link
              to="/chats"
              className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-full font-semibold transition-all transform hover:scale-105 shadow-lg"
            >
              Get Started
            </Link>
          </div>

          <div className="lg:w-1/2 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl transform rotate-6 scale-105 opacity-20"></div>

              <div className="relative bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-700">
                <div className="flex justify-center mb-6">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-full">
                    <FaRobot className="w-16 h-16 text-white" />
                  </div>
                </div>

                <div className="bg-gray-700 rounded-lg p-4 max-w-sm">
                  <div className="flex items-center gap-3 mb-3">
                    {getAvatarIcon(typingStatus)}
                    <TypeAnimation
                      sequence={[
                        "Human:We produce food for Mice",
                        2000,
                        () => setTypingStatus("bot"),
                        "Bot:We produce food for Hamsters",
                        2000,
                        () => setTypingStatus("human2"),
                        "Human2:We produce food for Guinea Pigs",
                        2000,
                        () => setTypingStatus("bot"),
                        "Bot:We produce food for Chinchillas",
                        2000,
                        () => setTypingStatus("human1"),
                      ]}
                      wrapper="span"
                      repeat={Infinity}
                      cursor={true}
                      omitDeletionAnimation={true}
                      className="text-sm text-gray-200"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center border-t border-gray-700 pt-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-full">
              <FaCrown className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold">OrbitAI</span>
          </div>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
            <Link
              to="/"
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              <FaFileContract className="w-3 h-3" />
              Terms of Service
            </Link>
            <span>|</span>
            <Link
              to="/"
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              <FaShieldAlt className="w-3 h-3" />
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
