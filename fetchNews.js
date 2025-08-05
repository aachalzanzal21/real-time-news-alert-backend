const axios = require('axios');

const fetchNews = async (category = 'general') => {
    try {
        const url = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=f831474618a243dfa53a109be7e5e877`;
        console.log("🔎 Fetching news from:", url);
        const { data } = await axios.get(url);

        console.log("✅ Articles fetched:", data.articles.length);
        return data.articles;
    } catch (err) {
        console.error("❌ Error fetching news:", err.response?.data || err.message);
        return [];
    }
};

module.exports = fetchNews;
