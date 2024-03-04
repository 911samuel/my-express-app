import express, { Router } from 'express';
import { signUp, signIn, single, all, update, delete1, deleteAll } from '../controllers/users'; 

const router: Router = Router(); 

router.post('/signUp', signUp);
router.post('/signIn', signIn);
router.get( '/all', all );
router.get( '/single/:id', single )
router.put('/update/:id', update)
router.delete('/delete/:id', delete1)
router.delete('/deleteAll', deleteAll)

export default router;
