// 커뮤니티 관련 라우터 (ES6 import/export)

import express from 'express';
import { getPosts } from '../controllers/communityController.js';

const router = express.Router();

// 게시글 목록 조회 라우트
router.get('/posts', getPosts);

export default router; 