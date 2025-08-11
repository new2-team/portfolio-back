import express from "express";
import passport from "passport";
import { localStrategy, jwtStrategy } from "../../controller/auth/authController.js";

const authRouter = express.Router();

// 이메일, 비밀번호 로그인 전략
authRouter.post("/local", passport.authenticate('local', { session : false }), localStrategy)

// jwt 토큰 전략
authRouter.post("/jwt", passport.authenticate('jwt', {session: false}), jwtStrategy)

// 구글 로그인 전략
const clientUrl = "http://localhost:3000"
authRouter.get('/google', passport.authenticate('google', { session : false, scope: ['profile', 'email']}))
authRouter.get(
    '/google/callback', passport.authenticate('google', 
    { session : false, failureRedirect : clientUrl }), 
    (req, res) => {
        const accessToken = req.user;
        // 화면을 다시 localhost:3000포트로 리다이렉트 시킨다.
        // 데이터를 보내준다
        // 두 가지를 모두하려면 데이터를 쿼리스트링으로 넘겨줘야한다.
        return res.redirect(`${clientUrl}/auth/my?accessToken=${accessToken}`)
    }
)

authRouter.get("/kakao", passport.authenticate('kakao', { session : false }))
authRouter.get("/kakao/callback", passport.authenticate('kakao', { failureRedirect: clientUrl }), (req, res) => {
    const accessToken = req.user;
    return res.redirect(`${clientUrl}/auth/my?accessToken=${accessToken}`)
})

authRouter.get("/naver", passport.authenticate('naver', { session : false, authType : 'reprompt' }))
authRouter.get("/naver/callback", passport.authenticate('naver', { failureRedirect: clientUrl }), (req, res) => {
    const accessToken = req.user;
    return res.redirect(`${clientUrl}/auth/my?accessToken=${accessToken}`)
})



export default authRouter;