// 몽고디비 연결 설정 파일입니다. 데이터베이스 연결 함수를 정의합니다.
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('몽고디비 연결 성공');
  } catch (err) {
    console.error('몽고디비 연결 실패:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
