const express = require('express');
const optionalAuth = require('../middleware/optionalAuth');
const fetchNews = require('../utils/fetchNews');
const sendEmail = require('../utils/sendEmail');
const protect = require('../middleware/auth');

const router = express.Router();

// Get all news with filtering
router.get('/all', async (req, res) => {
    const { category, startDate, endDate } = req.query;
    try {
        const news = await fetchNews(category, { startDate, endDate });
        res.json(news);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get headlines
router.get('/headlines', async (req, res) => {
    try {
        const headlines = await fetchNews('general', { pageSize: 5 });
        res.json(headlines);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


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

// Send test email
router.post('/send-email', protect, async (req, res) => {
    try {
        const user = req.user;
        let emailText = 'This is a test email with your news updates:\n\n';
        const articles = await fetchNews('general', { pageSize: 5 });
        if (articles.length > 0) {
            articles.forEach(article => {
                emailText += `${article.title}\n${article.url}\n\n`;
            });
        }
        await sendEmail(user.email, 'Test News Update', emailText);
        res.json({ message: 'Test email sent successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
