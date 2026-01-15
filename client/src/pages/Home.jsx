import { fetchNews } from "../services/api.js";
import { Link } from "react-router-dom";
import { useNewsStore } from "../store/store.js";

function Home() {
  const { query, setQuery, articles, setArticles, category, setCategory } =
    useNewsStore();

  const categories = [
    "All",
    "BBC",
    "CNN",
    "NDTV",
    "The Hindu",
    "India Today",
    "Hindustan Times",
    "Times of India",
    "The Guardian",
    "Al Jazeera",
    "Bloomberg",
    "Business Insider",
    "ABC News",
    "Fox News",
    "CBS News",
    "Sky News",
    "The New York Times",
    "The Washington Post",
    "Associated Press",
    "Economic Times",
  ];

  const searchNews = async (q = query, cat = category) => {
    if (!q.trim() && cat === "All") return;

    const res = await fetchNews({ q, category: cat });
    console.log("Fetched news:", res);
    setArticles(res.data.results || []);
  };

  const handleCategoryClick = async (cat) => {
    setCategory(cat);
    setQuery("");

    if (cat === "All") {
      await searchNews("breaking news articles today", "All");
    } else {
      await searchNews("", cat);
    }
  };

  const handleSearch = async () => {
    if (category !== "All" && query.trim()) {
      setCategory("All");
    }

    await searchNews(query, "All");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex gap-3 mb-8">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search news..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500"
          />
          <button
            onClick={handleSearch}
            className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg transition-colors"
          >
            Search
          </button>
        </div>

        <div className="flex gap-2 mb-8 pb-2 overflow-x-auto overflow-y-hidden scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                category === cat
                  ? "bg-green-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {articles.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((a, i) => (
              <Link
                to={"/article"}
                state={{ article: a }}
                key={i}
                className="bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                {a.image && (
                  <img
                    src={a.image}
                    alt={a.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="font-semibold mb-2 line-clamp-2">{a.title}</h3>
                  <p className="text-gray-400 text-sm line-clamp-3 mb-3">
                    {a.description || a.snippet}
                  </p>
                  <span className="text-green-400 text-sm font-medium">
                    Read more →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-12">No news found</p>
        )}
      </div>
    </div>
  );
}

export default Home;
