import express, { Router } from 'express';
import * as BrandController from '../controllers/brandController';
import upload from '../middlewares/upload'; 
import authenticate from '../middlewares/authenticate';
import { storeValidationRules, updateValidationRules } from '../middlewares/validation';
import isAdmin from "../middlewares/isAdmin";

const router: Router = Router(); 

router.get('/',authenticate, isAdmin, BrandController.index);
router.get('/show/:id',authenticate, isAdmin, BrandController.show);
router.post('/store',authenticate, isAdmin, storeValidationRules, upload.single('avatar'), BrandController.store);
router.put('/update/:id', authenticate, isAdmin, updateValidationRules, BrandController.update);
router.delete('/deleteBrand/:id',authenticate, authenticate, BrandController.deleteBrand);

export default router;