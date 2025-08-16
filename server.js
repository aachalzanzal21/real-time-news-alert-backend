const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const newsRoutes = require('./routes/newsRoutes');
require('./cron/newsAlerts');
dotenv.config();
const app = express();

const corsOptions = {
    origin: ['http://localhost:3000', 'https://latest-news-application.netlify.app'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));


app.use(express.json());

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Error:", err));

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/news', newsRoutes);

// Default Route
app.get('/', (req, res) => {
    res.send("News Alert API Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
