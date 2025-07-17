// 인증 미들웨어 (JWT 등, ES6 export)

const authMiddleware = (req, res, next) => {
  // 인증 로직 (예: JWT 토큰 검증)
  next();
};

export default authMiddleware; 