import express, { Router } from 'express';
import * as BrandController from '../controllers/brandController';
import upload from '../utils/upload'; 
import authenticate from '../utils/authenticate';
import { storeValidationRules, updateValidationRules } from '../utils/validation';

const router: Router = Router(); 

router.get('/',authenticate, BrandController.index);
router.get('/show/:id',authenticate, BrandController.show);
router.post('/store', authenticate,  storeValidationRules, upload.single('avatar'), BrandController.store);
router.put('/update/:id', updateValidationRules, BrandController.update);
router.delete('/deleteBrand/:id', BrandController.deleteBrand);

export default router;