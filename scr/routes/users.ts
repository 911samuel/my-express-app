import express, { Router } from 'express';
import { signUp, signIn, update, delete1, deleteAll } from '../controllers/users'; 
import upload from '../middlewares/upload';
import { validateUser, validateupdatedUser } from '../validations/users';

const router: Router = Router(); 

/**
 * @swagger
 * tags:
 *   - name: user
 *     description: Endpoints related to user
 */

router.post('/signUp', upload.single('profile'), signUp);
router.post('/signIn', signIn);
router.put('/update/:id', upload.single("profile"), update)
router.delete('/delete/:id', delete1)
router.delete('/deleteAll', deleteAll)

export default router;
