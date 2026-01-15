import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useNewsStore = create(
  persist(
    (set) => ({
      query: "",
      articles: [],
      category: "All",
      setQuery: (q) => set({ query: q }),
      setArticles: (data) => set({ articles: data }),
      setCategory: (cat) => set({ category: cat }),
    }),
    { name: "news-storage" }
  )
);
