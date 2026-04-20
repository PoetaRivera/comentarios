const express = require('express');
const router = express.Router();
const { createComment, getComments, updateComment, deleteComment } = require('../controllers/comments.controller');

router.post('/:appId', createComment);
router.get('/:appId', getComments);
router.put('/:appId/:commentId', updateComment);
router.delete('/:appId/:commentId', deleteComment);

module.exports = router;
