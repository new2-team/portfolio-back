// 사용자(회원) 관련 API 엔드포인트(주소)를 정의하고, 컨트롤러와 연결하는 라우터 파일입니다.
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// 회원가입 라우터
router.post('/register', userController.register);
// 로그인 라우터
router.post('/login', userController.login);

module.exports = router;
