import express, { Router } from 'express';
import AuthController from '../controllers/authController'; 
import upload from '../middlewares/upload';

const router: Router = Router(); 

router.post('/register', upload.single('avatar'), AuthController.register);
router.post('/login', AuthController.login);

export default router;
