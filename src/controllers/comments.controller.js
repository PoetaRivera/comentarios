const { db } = require('../config/firebase');

// Create a new comment
const createComment = async (req, res) => {
    console.log('createComment called');
    try {
        const { appId } = req.params;
        console.log('AppID:', appId);
        const { author, content, metadata } = req.body;

        if (!content) {
            return res.status(400).json({ error: 'Content is required' });
        }

        const newComment = {
            author: author || 'Anonymous',
            content,
            createdAt: new Date(),
            isVisible: true, // Default to visible
            metadata: metadata || {}
        };

        console.log('Writing to Firestore...');
        // Add to 'comments' subcollection under specific 'apps' document
        const docRef = await db.collection('apps').doc(appId).collection('comments').add(newComment);
        console.log('Firestore write success. ID:', docRef.id);

        return res.status(201).json({
            id: docRef.id,
            message: 'Comment created successfully',
            data: newComment
        });
    } catch (error) {
        console.error('Error creating comment:', error);
        return res.status(500).json({ error: error.message });
    }
};

// Get comments for an app
const getComments = async (req, res) => {
    try {
        const { appId } = req.params;
        const { limit = 20, startAfter } = req.query;

        let query = db.collection('apps').doc(appId).collection('comments')
            // .where('isVisible', '==', true) // Requires index with orderBy
            .orderBy('createdAt', 'desc')
            .limit(parseInt(limit));

        // Pagination logic could go here if we passed a doc snapshot, 
        // but for simple API usually we pass a timestamp or ID. 
        // For simplicity in this first version, we'll stick to basic queries.

        const snapshot = await query.get();

        if (snapshot.empty) {
            return res.status(200).json([]);
        }

        const comments = [];
        snapshot.forEach(doc => {
            comments.push({ id: doc.id, ...doc.data() });
        });

        return res.status(200).json(comments);

    } catch (error) {
        console.error('Error fetching comments:', error);
        return res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createComment,
    getComments
};

