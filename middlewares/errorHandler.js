// 에러 핸들링 미들웨어 (ES6 export)

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('서버 에러 발생');
};

export default errorHandler; 