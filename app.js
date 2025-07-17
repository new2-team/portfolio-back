// package.json에 "type": "module" 설정이 필요합니다.
// 메인 서버 파일 (ES6 import/export 방식)

import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import communityRoutes from './routes/communityRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import calendarRoutes from './routes/calendarRoutes.js';
import errorHandler from './middlewares/errorHandler.js';

// 환경변수(.env) 사용을 위한 dotenv 설정
dotenv.config();

// DB 연결
connectDB();

// Express 앱 생성
const app = express();

// JSON 파싱 미들웨어
app.use(express.json());

// 라우터 연결
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/calendar', calendarRoutes);

// 에러 핸들링 미들웨어 (항상 마지막에 위치)
app.use(errorHandler);

// 서버 실행
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`${PORT}번 포트에서 서버 실행 중`);
  console.log('MONGO_URI:', process.env.MONGO_URI);
});

app.get('/', (req, res) => {
  res.send('Mungpick 백엔드 서버에 오신 것을 환영합니다! 🎉');
});
