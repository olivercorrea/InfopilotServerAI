import express from 'express';
import { getBotGreeting, saveUserMessage } from '../controllers/chatController.js';

const router = express.Router();

router.get('/greeting', getBotGreeting);
router.post('/message', saveUserMessage);

export default router;
