// 커뮤니티 관련 라우터 (ES6 import/export)

import express from 'express';
import { getPosts, registerPost, removePost, registerReply, removeReply,toggleLike } from '../../controllers/community/communityController.js';

const communityRoutes = express.Router();

// 게시글 목록 조회 라우트
communityRoutes.get('/api/get-posts', getPosts);

// 게시글 등록
communityRoutes.post('/api/register-post', registerPost);

// 게시글 삭제
communityRoutes.delete('/api/remove-post/:post_id', removePost);

// 댓글 등록
communityRoutes.post('/api/register-reply', registerReply);

// 댓글 삭제
communityRoutes.delete('/api/remove-reply/:reply_id', removeReply);

// 좋아요 수 
communityRoutes.post('/api/toggle-like/:post_id', toggleLike);



export default communityRoutes; 