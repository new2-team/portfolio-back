// DB 연결 설정 파일 (ES6 import/export)
// mongoose 등 DB 연결 관련 설정을 이 파일에서 관리합니다.

import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB 연결 성공');
  } catch (error) {
    console.error('MongoDB 연결 실패:', error);
    process.exit(1);
  }
};

export default connectDB; 