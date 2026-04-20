const { db } = require('../config/firebase');
const { sanitizeId } = require('../utils/sanitizer');

const createComment = async (req, res) => {
    try {
        const appId = sanitizeId(req.params.appId);
        const { author, content, metadata } = req.body;

        if (!content) {
            return res.status(400).json({ error: 'Content is required' });
        }

        const newComment = {
            author: author || 'Anonymous',
            content,
            createdAt: new Date(),
            isVisible: true,
            metadata: metadata || {}
        };

        const docRef = await db.collection('apps').doc(appId).collection('comments').add(newComment);

        return res.status(201).json({
            id: docRef.id,
            message: 'Comment created successfully',
            data: newComment
        });
    } catch (error) {
        console.error('Error creating comment:', error);
        return res.status(500).json({ error: 'Error al crear el comentario' });
    }
};

const getComments = async (req, res) => {
    try {
        const appId = sanitizeId(req.params.appId);
        const { limit = 20, startAfter } = req.query;

        let query = db.collection('apps').doc(appId).collection('comments')
            .where('isVisible', '==', true)
            .orderBy('createdAt', 'desc')
            .limit(parseInt(limit));

        if (startAfter) {
            const cursorDoc = await db.collection('apps').doc(appId).collection('comments').doc(startAfter).get();
            if (cursorDoc.exists) {
                query = query.startAfter(cursorDoc);
            }
        }

        const snapshot = await query.get();

        if (snapshot.empty) return res.status(200).json([]);

        const comments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return res.status(200).json(comments);

    } catch (error) {
        console.error('Error fetching comments:', error);
        return res.status(500).json({ error: 'Error al obtener los comentarios' });
    }
};

const updateComment = async (req, res) => {
    try {
        const appId = sanitizeId(req.params.appId);
        const { commentId } = req.params;
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({ error: 'Content is required' });
        }

        const ref = db.collection('apps').doc(appId).collection('comments').doc(commentId);
        const doc = await ref.get();

        if (!doc.exists) {
            return res.status(404).json({ error: 'Comentario no encontrado' });
        }

        await ref.update({ content, updatedAt: new Date() });
        return res.status(200).json({ message: 'Comentario actualizado' });

    } catch (error) {
        console.error('Error updating comment:', error);
        return res.status(500).json({ error: 'Error al actualizar el comentario' });
    }
};

const deleteComment = async (req, res) => {
    try {
        const appId = sanitizeId(req.params.appId);
        const { commentId } = req.params;

        const ref = db.collection('apps').doc(appId).collection('comments').doc(commentId);
        const doc = await ref.get();

        if (!doc.exists) {
            return res.status(404).json({ error: 'Comentario no encontrado' });
        }

        // Soft delete
        await ref.update({ isVisible: false });
        return res.status(200).json({ message: 'Comentario eliminado' });

    } catch (error) {
        console.error('Error deleting comment:', error);
        return res.status(500).json({ error: 'Error al eliminar el comentario' });
    }
};

module.exports = { createComment, getComments, updateComment, deleteComment };
