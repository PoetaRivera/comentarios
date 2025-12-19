const express = require('express');
const router = express.Router();
const { createComment, getComments } = require('../controllers/comments.controller');

// POST /api/comments/:appId
router.post('/:appId', createComment);

// GET /api/comments/:appId
router.get('/:appId', getComments);

module.exports = router;
