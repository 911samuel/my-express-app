import express, { Router } from 'express';
import * as BrandController from '../controllers/brandController';
import upload from '../utils/upload'; 

const router: Router = Router(); 

router.get('/', BrandController.index);
router.get('/show/:id', BrandController.show);
router.post('/store', upload.single('avatar'), BrandController.store);
router.put('/update/:id', BrandController.update);
router.delete('/deleteBrand/:id', BrandController.deleteBrand);

export default router;
