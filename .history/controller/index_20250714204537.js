// 사용자(회원) 관련 요청을 처리하는 컨트롤러 파일입니다. 회원가입, 로그인 등 기능이 포함됩니다.
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 회원가입
exports.register = async (req, res) => {
  try {
    const { email, password, nickname } = req.body;
    // 비밀번호 암호화
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashed, nickname });
    await user.save();
    res.status(201).json({ message: '회원가입 성공' });
  } catch (err) {
    res.status(400).json({ message: '회원가입 실패', error: err.message });
  }
};

// 로그인
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    // JWT 토큰 발급
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, nickname: user.nickname });
  } catch (err) {
    res.status(500).json({ message: '로그인 실패', error: err.message });
  }
};
