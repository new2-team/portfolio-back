// 커뮤니티 관련 라우터 (ES6 import/export)

import express from 'express';
import { getPosts, registerPost, removePost, registerReply, removeReply,toggleLike } from '../controllers/communityController.js';

const communityRoutes = express.Router();

// 게시글 목록 조회 라우트
router.get('/get-posts', getPosts);

// 게시글 등록
router.post('/register-post', registerPost);

// 게시글 삭제
router.delete('remove-post', removePost);

// 댓글 등록
router.post('register-reply', registerReply);

// 댓글 삭제
router.delete('remove-reply', removeReply);

// 좋아요 수 
router.post('toggle-like', toggleLike);



export default communityRoutes; 