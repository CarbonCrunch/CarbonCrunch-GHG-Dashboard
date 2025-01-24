import express from 'express';
import { signUpUser } from '../controllers/bloguser.controller.js';

const router = express.Router();

router.post('/signUp', signUpUser);

export default router;