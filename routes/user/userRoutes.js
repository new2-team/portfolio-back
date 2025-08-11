import express from "express";
import { registerUser, loginUser, modifyUser, removeUser, modifyPicture } from "../../controller/user/userController.js";

const userRouter = express.Router();

//post인 이유 -> 회원가입은 데이터를 생성하는 것이기 때문에 post 사용 , 회원정보는 데이터를 숨겨야함

//회원가입
//http://localhost:8000/users/api/register
userRouter.post("/register", registerUser);

//로그인
//http://localhost:8000/users/api/login
userRouter.post("/login", loginUser);

//회원정보 수정
//http://localhost:8000/users/api/update
userRouter.put("/update", modifyUser);

//회원 탈퇴
//http://localhost:8000/users/api/delete
userRouter.delete("/delete", removeUser);

//썸네일 이미지 변경
//http://localhost:8000/users/api/update-thumbnail
userRouter.put("/update-thumbnail", modifyPicture);

export default userRouter;