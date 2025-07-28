// package.json에 "type": "module" 설정이 필요합니다.
// 메인 서버 파일 (ES6 import/export 방식)

import cors from "cors";
import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import errorHandler from './middlewares/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import calendarRoutes from './routes/calendarRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import communityRoutes from './routes/communityRoutes.js';
import userRoutes from './routes/userRoutes.js';

// 환경변수(.env) 사용을 위한 dotenv 설정
dotenv.config();

// DB 연결
connectDB();

// Express 앱 생성
const app = express();

// cors 설정
// app.use()는 미들웨어로서,
// 어떤 요청이든 지정된 로직보다 먼저 작업한다. 즉 전처리이다.
app.use(cors({
  origin : "http://localhost:3000",
  method : ['GET', 'POST', 'PUT', 'DELETE'],
  // credentials : true
}))

// JSON 파싱 미들웨어
app.use(express.json());

// extended true, qs모듈을 사용하여 쿼리스트링 인식
app.use(express.urlencoded({extended : false}))
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  next()
})

// passport 설정
// app.use(passport.initialize())
// initializePassport()

// 라우터 연결
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/community', communityRoutes);
app.use("/chatting/api", chatRoutes);
app.use('/calendar/api', calendarRoutes);

// 에러 핸들링 미들웨어 (항상 마지막에 위치)
app.use(errorHandler);

// 서버 실행
const PORT = process.env.PORT || 8000;

// 웹소켓 서버랑 통합
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ['GET', 'POST', 'PUT', 'DELETE']}
})


// chatRoutes(io)

server.listen(PORT, () => {
  console.log(`${PORT}번 포트에서 서버 실행 중`);
  console.log('MONGO_URI:', process.env.MONGO_URI);
  console.log(`웹 소켓, express 통합 실행!`)
})

app.get('/', (req, res) => {
  res.send('Mungpick 백엔드 서버에 오신 것을 환영합니다! 🎉');
});
