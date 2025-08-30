import express from 'express';
import { getInquiryReplys, getInquirys, postInquiry, postInquiryReply } from '../../controllers/inquiry/inquiryController.js';
const inquiryRoutes = express.Router()

// 문의글 등록
// http://localhost:8000/inquiry/api/post-inquiry
inquiryRoutes.post('/api/post-inquiry', postInquiry)

// 문의글 조회
// http://localhost:8000/inquiry/api/get-inquirys
inquiryRoutes.get('/api/get-inqirys', getInquirys)

// 문의글 답글 등록
// http://localhost:8000/inquiry/api/post-inquiry-reply
inquiryRoutes.post('/api/post-inquiry-reply', postInquiryReply)

// 문의글 답글 조회
// http://localhost:8000/inquiry/api/get-inquiry-replys
inquiryRoutes.get('/api/get-inquiry-replys', getInquiryReplys)



export default inquiryRoutes