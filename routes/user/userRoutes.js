import express from "express";
import { registerUser, loginUser, profileRegistration, modifyUser, removeUser, modifyPicture } from "../../controllers/user/userController.js";

const userRouter = express.Router();

// 2단계: 회원정보 입력 (기본 회원가입)
userRouter.post("/api/signup", registerUser);

// 3단계: 프로필 등록 (강아지 프로필)
userRouter.post("/api/profile-registration", profileRegistration);

// 로그인
userRouter.post("/api/login", loginUser);

// 회원정보 수정
userRouter.put("/api/update", modifyUser);

// 회원 탈퇴
userRouter.delete("/api/delete", removeUser);

// 썸네일 이미지 변경
userRouter.put("/api/update-thumbnail", modifyPicture);

export default userRouter;