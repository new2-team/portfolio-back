// passport auth 설정값 파일
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as KakaoStrategy } from "passport-kakao";
import { Strategy as NaverStrategy } from "passport-naver-v2";
import User from "../models/userSchema.js";
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

dotenv.config()
const SECRET_KEY = process.env.SECRET_KEY;


// username, password
const passwordConfig = {
    usernameField: 'user_id', passwordField: 'password'
}

// 로그인 로직
const passwordVerify = async (user_id, password, done) => {
    const user = await User.findOne({user_id : user_id}).lean();

    if(!user){
        console.log("로직 실행")
        return done(null, false, {message: "존재하지 않는 사용자입니다."})
    }

    // 유저 해쉬된 비밀번호를 비교
    const plainPassword = password;
    const hashedPassword = user.password;

    bcrypt.compare(plainPassword, hashedPassword, (err, result) => {
        if(err){
            return done(err)
        }
        
        if(result){
            // 로그인 성공
            return done(null, user)
        }else {
            return done(null, false, { message: '올바르지 않은 비밀번호 입니다.'})
        }
    })
}

// jwt 토큰 검증
const jwtConfig = {
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey : SECRET_KEY,
}  

// jwt 토큰 검증 로직
const jwtVerify = async (jwtPayload, done) => {
    const user_id = jwtPayload.user_id
    const user = await User.findOne({user_id : user_id}).lean();
    if(!user){
        done(null, false, { message : "올바르지 않은 인증정보 입니다."})
    }

    return done(null, user);
}

// 구글 로그인 설정
const googleConfig = {
    clientID : process.env.GOOGLE_ID,
    clientSecret : process.env.GOOGLE_SECRET,
    callbackURL : "/auth/google/callback"
}

// 구글 로그인 검증
const googleVerify = async (accessToken, refreshToken, profile, done) => {
    const {id, emails, displayName, picture, provider} = profile;
    const email = emails[0].value;

    try {
        let exUser = null
        exUser = await User.findOne({email: email}).lean()

        // 만약 유저가 없다면 회원가입
        if(!exUser){
            // user_id 생성 (email 기반으로 고유한 ID 생성)
            const baseUserId = email.split('@')[0];
            let user_id = baseUserId;
            let counter = 1;
            
            // user_id 중복 확인 및 생성
            while (await User.findOne({user_id: user_id})) {
                user_id = `${baseUserId}${counter}`;
                counter++;
            }

            await User.create({
                user_id: user_id,
                email: email,
                name: displayName,
                picture: picture || "none_picture.jpg",
                picturePath: "default",
                provider: "google",
                type: 'g', // 구글 로그인 사용자 타입
                profileComplete: false
            })

            // 회원가입 후 조회
            exUser = await User.findOne({ email: email }).lean();
        }

        const accessToken = jwt.sign(
            {
                user_id: exUser.user_id,
                issuer: 'mungpick',
            },
            SECRET_KEY,
            {
                expiresIn: '24h'
            }
        )

        // 이미 가입되었다면 토큰 발급해서 로그인,
        // 회원가입 후 토큰 발급해서 로그인
        done(null, accessToken)

    } catch (error) {
        console.log("googleVerify Error")
        console.error(error)
        done(error)
    }
}

// 카카오 로그인 설정
const kakaoConfig = {
    clientID : process.env.KAKAO_KEY,
    callbackURL : "/auth/kakao/callback"
}

// 카카오 로그인 검증
const kakaoVerify = async (accessToken, refreshToken, profile, done) => {
    console.log("kakaoProfile", profile)
    
    try {
        const {id, username, _json} = profile;
        const email = _json.kakao_account?.email;
        const displayName = username || `kakao_${id}`;
        
        let exUser = null;
        if (email) {
            exUser = await User.findOne({email: email}).lean();
        }
        
        // 만약 유저가 없다면 회원가입
        if(!exUser){
            // user_id 생성
            let user_id = `kakao_${id}`;
            let counter = 1;
            
            // user_id 중복 확인 및 생성
            while (await User.findOne({user_id: user_id})) {
                user_id = `kakao_${id}_${counter}`;
                counter++;
            }

            await User.create({
                user_id: user_id,
                email: email,
                name: displayName,
                picture: "default_kakao.jpg",
                picturePath: "default",
                provider: "kakao",
                type: 'k', // 카카오 로그인 사용자 타입
                profileComplete: false
            })

            // 회원가입 후 조회
            exUser = await User.findOne({ user_id: user_id }).lean();
        }

        const accessToken = jwt.sign(
            {
                user_id: exUser.user_id,
                issuer: 'mungpick',
            },
            SECRET_KEY,
            {
                expiresIn: '24h'
            }
        )

        done(null, accessToken)

    } catch (error) {
        console.log("kakaoVerify Error")
        console.error(error)
        done(error)
    }
}

// 네이버 로그인 설정
const naverConfig = {
    clientID : process.env.NAVER_CLIENT_ID,
    clientSecret : process.env.NAVER_CLIENT_SECRET,
    callbackURL : "/auth/naver/callback"
}

// 네이버 로그인 검증
const naverVerify = async (accessToken, refreshToken, profile, done) => {
    console.log("naverProfile", profile)
    
    try {
        const {id, displayName, emails} = profile;
        const email = emails?.[0]?.value;
        const name = displayName || `naver_${id}`;
        
        let exUser = null;
        if (email) {
            exUser = await User.findOne({email: email}).lean();
        }
        
        // 만약 유저가 없다면 회원가입
        if(!exUser){
            // user_id 생성
            let user_id = `naver_${id}`;
            let counter = 1;
            
            // user_id 중복 확인 및 생성
            while (await User.findOne({user_id: user_id})) {
                user_id = `naver_${id}_${counter}`;
                counter++;
            }

            await User.create({
                user_id: user_id,
                email: email,
                name: name,
                picture: "default_naver.jpg",
                picturePath: "default",
                provider: "naver",
                type: 'n', // 네이버 로그인 사용자 타입
                profileComplete: false
            })

            // 회원가입 후 조회
            exUser = await User.findOne({ user_id: user_id }).lean();
        }

        const accessToken = jwt.sign(
            {
                user_id: exUser.user_id,
                issuer: 'mungpick',
            },
            SECRET_KEY,
            {
                expiresIn: '24h'
            }
        )

        done(null, accessToken)

    } catch (error) {
        console.log("naverVerify Error")
        console.error(error)
        done(error)
    }
}
 
// passport 초기화
const initializePassport = () => {
    passport.use('local', new LocalStrategy(passwordConfig, passwordVerify))
    passport.use('jwt', new JwtStrategy(jwtConfig, jwtVerify))
    passport.use('google', new GoogleStrategy(googleConfig, googleVerify))
    passport.use('kakao', new KakaoStrategy(kakaoConfig, kakaoVerify))
    passport.use('naver', new NaverStrategy(naverConfig, naverVerify))
}

export default initializePassport; 