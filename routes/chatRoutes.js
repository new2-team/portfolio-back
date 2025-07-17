// 채팅 관련 라우터 (ES6 import/export)

import express from 'express';
import { getChats } from '../controllers/chatController.js';

const router = express.Router();

// 채팅 목록 조회 라우트
router.get('/chats', getChats);

export default router; 