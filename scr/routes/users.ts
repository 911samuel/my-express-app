import express, { Router } from 'express';
import { signUp, signIn, update, delete1, deleteAll } from '../controllers/users'; 
import upload from '../middlewares/upload';

const router: Router = Router(); 

/**
 * @swagger
 * tags:
 *   - name: user
 *     description: Endpoints related to user
 */

router.post('/signUp', upload.single('avatar'), signUp);
router.post('/signIn', signIn);
router.put('/update/:id', update)
router.delete('/delete/:id', delete1)
router.delete('/updateAll', deleteAll)

export default router;
