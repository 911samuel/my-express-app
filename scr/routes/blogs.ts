import express, { Router } from 'express';
import { all, single, create, update, delete1, deleteAll } from '../controllers/blogs';
import upload from '../middlewares/upload'; 
import authenticate from '../middlewares/authenticate';
import isAdmin from "../middlewares/isAdmin";

const router: Router = Router(); 

/**
 * @swagger
 * tags:
 *   - name: blog
 *     description: Endpoints related to blog
 */

router.get('/all',authenticate, isAdmin, all);
router.get('/single/:id',authenticate, isAdmin, single);
router.post('/create',authenticate, isAdmin, upload.single('imgUrl'), create);
router.put('/update/:id', authenticate, isAdmin, update);
router.delete('/delete/:id',authenticate, authenticate, delete1);
router.delete('/deleteAll', authenticate, isAdmin, deleteAll);

export default router;