import express, { Router } from 'express';
import { signUp, signIn, single, all, update, delete1, deleteAll } from '../controllers/users'; 
import upload from '../middlewares/upload';

const router: Router = Router(); 

router.post('/signUp', upload.single('profile'), signUp);
router.post('/signIn', signIn);
router.get( '/all', all );
router.get( '/single/:id', single )
router.put('/update/:id', upload.single("profile"), update)
router.delete('/delete/:id', delete1)
router.delete('/deleteAll', deleteAll)

export default router;
