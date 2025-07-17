// 유저 관련 라우터 (ES6 import/export)

import express from 'express';
import { getProfile } from '../controllers/userController.js';

const router = express.Router();

// 프로필 조회 라우트
router.get('/profile', getProfile);

export default router; 