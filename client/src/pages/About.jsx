import { Link } from "react-router-dom";
import {
  FaRobot,
  FaSearch,
  FaNewspaper,
  FaRocket,
  FaUsers,
  FaLock,
} from "react-icons/fa";

function About() {
  const features = [
    {
      icon: <FaNewspaper className="w-8 h-8" />,
      title: "Latest News",
      description:
        "Stay updated with real-time news from trusted sources across various categories including technology, business, sports, and more.",
    },
    {
      icon: <FaRobot className="w-8 h-8" />,
      title: "AI Chat Assistant",
      description:
        "Get instant answers and insights about news articles. Our AI assistant helps you understand complex topics and find related information.",
    },
    {
      icon: <FaRocket className="w-8 h-8" />,
      title: "Fast & Reliable",
      description:
        "Quick loading times and reliable news delivery ensure you get the information you need when you need it.",
    },
    {
      icon: <FaUsers className="w-8 h-8" />,
      title: "User-Friendly",
      description:
        "Clean, intuitive interface designed for seamless navigation and optimal reading experience across all devices.",
    },
    {
      icon: <FaLock className="w-8 h-8" />,
      title: "Privacy Focused",
      description:
        "Your privacy matters. We don't sell your data and ensure secure interactions with our AI chatbot.",
    },
    {
      icon: <FaSearch className="w-8 h-8" />,
      title: "Smart Search",
      description:
        "Advanced search functionality to find specific news topics, trends, and related articles across multiple sources instantly.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            About NewsOrbit
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Revolutionizing how you consume and interact with news through
            artificial intelligence. NewsOrbit combines real-time news
            aggregation with an intelligent chatbot to provide deeper insights
            and understanding.
          </p>
        </div>

        <div className="bg-gray-800 rounded-2xl p-8 mb-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-gray-300 text-lg mb-4">
                In today's fast-paced world, staying informed is crucial.
                However, the sheer volume of news can be overwhelming. NewsOrbit
                was born from the need to not just read news, but to understand
                it.
              </p>
              <p className="text-gray-300 text-lg">
                We leverage cutting-edge AI technology to help you dive deeper
                into news stories, ask questions, and get instant
                explanations—making news consumption more interactive and
                meaningful.
              </p>
            </div>
            <div className="bg-gray-700 rounded-xl p-6">
              <div className="text-center">
                <FaRobot className="w-20 h-20 text-green-400 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold mb-3">
                  Smart News Experience
                </h3>
                <p className="text-gray-300">
                  Combining the latest in AI with comprehensive news coverage to
                  create an unparalleled information experience.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose NewsOrbit?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-colors"
              >
                <div className="text-green-400 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 rounded-2xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Browse News</h3>
              <p className="text-gray-400">
                Explore latest articles across multiple categories from trusted
                sources
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Chat with AI</h3>
              <p className="text-gray-400">
                Ask questions about articles and get instant, intelligent
                responses
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Get Insights</h3>
              <p className="text-gray-400">
                Discover key takeaways and AI-powered summaries for any news
                story
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r bg-gray-800 rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Explore?</h2>
          <p className="text-xl mb-6 opacity-90">
            Start your journey with smarter news consumption today.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/"
              className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Browse News
            </Link>
            <Link
              to="/chats"
              className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors"
            >
              Try Chatbot
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
