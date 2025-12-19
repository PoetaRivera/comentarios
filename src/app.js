const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const commentsRoutes = require('./routes/comments.routes');

const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/comments', commentsRoutes);

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date() });
});

module.exports = app;
