import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { summarizeText } from "../services/api";
import {
  FiArrowLeft,
  FiExternalLink,
  FiCopy,
  FiCheck,
  FiBookmark,
} from "react-icons/fi";
import Markdown from "react-markdown";

function Article() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const article = state?.article;

  const [data, setData] = useState("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!article?.link) {
        setLoading(false);
        return;
      }

      try {
        const res = await summarizeText(article.link, article.title);
        console.log("Gemini summary response:", res);
        setData(res);
      } catch (err) {
        console.error("Error fetching Gemini summary:", err);
        setData({
          summary:
            "Unable to generate summary at this time. Please try again later. You can read the original article using the link below.",
          source: "Error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [article]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleBookmark = () => {
    setBookmarked(!bookmarked);
  };

  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0d0d0d] to-[#1a1a2e] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4 opacity-80 animate-pulse">📰</div>
          <h2 className="text-2xl font-bold text-white mb-3">
            Article Not Found
          </h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            No article selected. Go back to browse our news collection.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-[#20808D] to-[#2D9AA6] text-white font-medium py-3 px-8 rounded-xl transition-all hover:scale-105 hover:shadow-lg shadow-[#20808D]/20"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <FiArrowLeft />
            <span>Back</span>
          </button>
          <button
            onClick={toggleBookmark}
            className={`p-2 rounded-lg ${
              bookmarked ? "text-yellow-400" : "text-gray-400 hover:text-white"
            }`}
          >
            <FiBookmark className={bookmarked ? "fill-current" : ""} />
          </button>
        </div>

        <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg">
          {article?.image && (
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-64 object-cover"
            />
          )}

          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">{article?.title}</h1>

            <div className="flex items-center gap-4 mb-6">
              {data.source && (
                <span className="bg-green-600 px-3 py-1 rounded-full text-sm">
                  {data.source}
                </span>
              )}
              <div className="flex gap-2 ml-auto">
                <a
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg text-sm transition-colors"
                >
                  <FiExternalLink />
                  <span>Original</span>
                </a>
                <button
                  onClick={() => copyToClipboard(article.link)}
                  className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg text-sm transition-colors"
                >
                  {copied ? <FiCheck className="text-green-400" /> : <FiCopy />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </div>

            {loading && (
              <div className="text-center py-8">
                <div className="flex justify-center gap-1 mb-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <div
                    className="w-2 h-2 bg-green-500 rounded-full animate-pulse"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-green-500 rounded-full animate-pulse"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
                <p className="text-gray-400">Generating summary...</p>
              </div>
            )}

            {!loading && data?.summary && (
              <div className="bg-gray-700/50 rounded-lg p-4">
                <h3 className="font-semibold mb-3 text-green-400">
                  AI Summary
                </h3>
                <div className="text-gray-200 leading-relaxed">
                  <Markdown>{data.summary}</Markdown>
                </div>
              </div>
            )}

            {!loading &&
              article?.snippet &&
              (!data?.summary || data.source === "Error") && (
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Article Preview</h3>
                  <p className="text-gray-300">{article.snippet}</p>
                </div>
              )}
          </div>
        </div>

        <div className="flex gap-3 justify-center mt-6">
          <button
            onClick={() => navigate("/")}
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
          >
            More News
          </button>
          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors"
          >
            Read Full
          </a>
        </div>
      </div>
    </div>
  );
}

export default Article;
