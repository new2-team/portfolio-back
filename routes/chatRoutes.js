// 채팅 관련 라우터 (ES6 import/export)

import express from 'express';
import { getChatMessage, getChatPictures, getChattingRoom, getComingSchedules, getFriendsList, postChatMessage, postChatPic, postChattingRoom } from '../controllers/chatController.js';

const chatRoutes = express.Router();

// rootRouter.use("/chatting/api", calendarRoutes)
// 등록: post, 조회: get, 수정: put, 삭제: delete

// 친구 목록 조회
// http://localhost:8000/chatting/api/get-friendsList
chatRoutes.get('/get-friendsList', getFriendsList);

// 채팅방 생성 - 필요 잇을까?
// http://localhost:8000/chatting/api/get-friendsList
chatRoutes.post('/post-friendsList', postChattingRoom);

// 채팅방 조회
// http://localhost:8000/chatting/api/get-chattingRoom
chatRoutes.get('/get-chattingRoom', getChattingRoom);

// 채팅메시지 내용 조회
// http://localhost:8000/chatting/api/get-chatMessage
chatRoutes.get('/get-chatMessage', getChatMessage);

// 메시지 전송
// http://localhost:8000/chatting/api/post-chatMessage
chatRoutes.post('/post-chatMessage', postChatMessage);

// 메시지 사진 업로드
// http://localhost:8000/chatting/api/post-chatPic
chatRoutes.post('/post-chatPic', postChatPic);

// 메시지 사진 모아보기
// http://localhost:8000/chatting/api/get-chatPictures
chatRoutes.get('/get-chatPictures', getChatPictures);

// 채팅 상대와의 일정 목록 조회
// http://localhost:8000/chatting/api/get-comingSchedules
chatRoutes.get('/get-comingSchedules', getComingSchedules);

export default chatRoutes; 


