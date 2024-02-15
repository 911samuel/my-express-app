import express from 'express';
import { Router } from 'express';
import * as BrandController from '../controllers/brandController';

const router: Router = express.Router();

router.get('/', BrandController.index);
router.get('/show/:id', BrandController.show);
router.post('/store', BrandController.store);
router.put('/update/:id', BrandController.update);
router.delete('/deleteBrand/:id', BrandController.deleteBrand);

export default router;
