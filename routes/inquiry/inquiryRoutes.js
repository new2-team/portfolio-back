import express from 'express';
import { postInquiry } from '../../controllers/inquiry/inquiryController.js';
const inquiryRoutes = express.Router()

// 문의글 등록
// http://localhost:8000/inquiry/api/post-inquiry
inquiryRoutes.put('/post-inquiry', postInquiry)

export default inquiryRoutes