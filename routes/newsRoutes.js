const express = require('express');
const optionalAuth = require('../middleware/optionalAuth');
const fetchNews = require('../utils/fetchNews');

const router = express.Router();

// Get news based on user's preference
router.get('/', optionalAuth, async (req, res) => {
    try {
        const categories = req?.user?.preferences?.categories || ['general'];
        const allNews = [];

        console.log(categories,"categories")


        for (const category of categories) {
            const news = await fetchNews(category);
            allNews.push(...news);
        }

        res.json(allNews);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
