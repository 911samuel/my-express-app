import express from 'express';
import commentController from '../controllers/commentController';
import isUser from '../middlewares/isUser';

const router = express.Router();

router.post('/comments/:id', isUser, commentController.addComment);

export default router;
