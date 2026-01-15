import express from "express";

const router = express.Router();

router.get("/", async (req, res) => {
  const { q, category } = req.query;

  let query = q?.trim() || "latest news";

  if (category && category !== "All") {
    query = `${category} latest news today`;
  }

  try {
    const enhancedQuery = `${query} "article" "news" site:news.google.com OR site:apnews.com OR site:bbc.com/news OR site:cnn.com OR site:thehindu.com OR site:ndtv.com`;

    const url = `https://www.googleapis.com/customsearch/v1?key=${
      process.env.GOOGLE_API_KEY
    }&cx=${process.env.SEARCH_ENGINE_ID}&q=${encodeURIComponent(
      enhancedQuery
    )}&num=10`;

    const response = await fetch(url);
    const data = await response.json();

    const results = data.items?.map((item) => ({
      title: item.title,
      link: item.link,
      snippet: item.snippet,
      image:
        item.pagemap?.cse_image?.[0]?.src ||
        item.pagemap?.metatags?.[0]?.["og:image"] ||
        item.pagemap?.metatags?.[0]?.["twitter:image"] ||
        null,
    }));

    res.json({ results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

export default router;
