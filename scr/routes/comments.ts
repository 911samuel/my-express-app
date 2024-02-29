import express from 'express';
import { add, update, delete1 } from '../controllers/comments';
import isUser from '../middlewares/isUser';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: comment
 *     description: Endpoints related to comment
 */


router.post('/add/:id', isUser, add);
router.put('/update/:id', isUser, update);
router.post('/delete/:id', isUser, delete1);

export default router;
