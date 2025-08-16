const cron = require('node-cron');
const User = require('../models/User');
const fetchNews = require('../utils/fetchNews');
const sendEmail = require('../utils/sendEmail');

// Schedule cron job to run every hour
cron.schedule('0 * * * *', async () => {
    console.log('Running news alert cron job...');
    try {
        const users = await User.find({ 'preferences.emailAlerts': true });

        for (const user of users) {
            const { email, preferences } = user;
            const { categories, frequency } = preferences;

            if (frequency === 'hourly') {
                let emailText = 'Here are your hourly news updates:\n\n';
                for (const category of categories) {
                    const articles = await fetchNews(category, { pageSize: 5 });
                    if (articles.length > 0) {
                        emailText += `--- ${category.toUpperCase()} ---\n`;
                        articles.forEach(article => {
                            emailText += `${article.title}\n${article.url}\n\n`;
                        });
                    }
                }
                await sendEmail(email, 'Hourly News Update', emailText);
            }
        }
    } catch (error) {
        console.error('Error in news alert cron job:', error);
    }
});
