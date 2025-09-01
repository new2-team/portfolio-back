import express from 'express';
import { getInquiryReply, getInquiry, postInquiry, postInquiryReply } from '../../controllers/inquiry/inquiryController.js';
const inquiryRoutes = express.Router()

// 문의글 등록
// http://localhost:8000/inquiry/api/post-inquiry
inquiryRoutes.post('/post-inquiry', postInquiry)

// 문의글 전체 조회
// http://localhost:8000/inquiry/api/get-inquiry
inquiryRoutes.get('/get-inquiry', getInquiry)

// 문의글 답글 등록
// http://localhost:8000/inquiry/api/post-inquiry-reply
inquiryRoutes.post('/post-inquiry-reply', postInquiryReply)

// 문의글 답글 조회
// http://localhost:8000/inquiry/api/get-inquiry-reply
inquiryRoutes.get('/get-inquiry-reply', getInquiryReply)



export default inquiryRoutes