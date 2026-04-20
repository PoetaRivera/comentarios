const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const commentsRoutes = require('./routes/comments.routes');

const app = express();

const allowedOrigins = [
    'https://poetarivera.github.io',
    'http://localhost:3000',
    'http://127.0.0.1:5500',
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
        callback(new Error('CORS: origen no permitido'));
    }
}));
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/comments', commentsRoutes);

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date() });
});

module.exports = app;
