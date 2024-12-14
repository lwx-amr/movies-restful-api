export default () => ({
  tmdb: {
    apiKey: process.env.TMDB_API_KEY,
    baseUrl: process.env.TMDB_BASE_URL,
    maxPages: process.env.TMDB_MAX_PAGES,
  },
});
