// 사용자(회원) 데이터베이스 스키마와 모델을 정의하는 파일입니다.
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true }, // 이메일(고유)
  password: { type: String, required: true }, // 비밀번호(암호화 저장)
  nickname: { type: String, required: true } // 닉네임
  // 추가 필드는 필요에 따라 여기에 작성
});

module.exports = mongoose.model('User', userSchema);
