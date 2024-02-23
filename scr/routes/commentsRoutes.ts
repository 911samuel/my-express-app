import express, { Router } from 'express';
import commentControllers from '../controllers/commentController'; 

const router: Router = Router(); 

router.post('/comment', commentControllers.createComment);

export default router;
