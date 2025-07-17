// 캘린더 관련 라우터 (ES6 import/export)

import express from 'express';
import { getSchedules } from '../controllers/calendarController.js';

const router = express.Router();

// 일정 목록 조회 라우트
router.get('/schedules', getSchedules);

export default router; 