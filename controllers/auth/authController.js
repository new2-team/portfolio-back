import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import User from '../../models/userSchema.js'

dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

// 회원가입 함수
export const signup = async (req, res) => {
    try {
        const { 
            user_id, 
            email, 
            password, 
            name, 
            tel, 
            ad_yn = false, 
            pri_yn = true, 
            type = 'i', 
            birth 
        } = req.body;

        // 필수 필드 검증 (이메일은 선택사항)
        if (!user_id || !password || !name) {
            return res.status(400).json({
                success: false,
                message: "필수 정보가 누락되었습니다. (user_id, password, name)"
            });
        }

        // 아이디 형식 검증
        const userIdRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9]{6,}$/;
        if (!userIdRegex.test(user_id)) {
            return res.status(400).json({
                success: false,
                message: "아이디는 영문과 숫자를 포함한 6자리 이상으로 입력해주세요."
            });
        }

        // 이메일이 제공된 경우 형식 검증
        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    success: false,
                    message: "올바른 이메일 형식이 아닙니다."
                });
            }
        }

        // 전화번호 형식 검증 (선택사항)
        if (tel) {
            const phoneRegex = /^01[0-9]-\d{3,4}-\d{4}$|^01[0-9]\d{8,11}$/;
            if (!phoneRegex.test(tel.toString())) {
                return res.status(400).json({
                    success: false,
                    message: "올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678 또는 01012345678)"
                });
            }
        }

        // 비밀번호 형식 검증
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                success: false,
                message: "비밀번호는 영문, 숫자, 특수문자를 포함한 8자리 이상으로 입력해주세요."
            });
        }

        // 중복 사용자 확인
        const existingUser = await User.findOne({
            $or: [
                { user_id: user_id },
                ...(email ? [{ email: email }] : [])
            ]
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "이미 존재하는 사용자 ID 또는 이메일입니다."
            });
        }

        // 비밀번호 해시화
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 새 사용자 생성
        const newUser = new User({
            user_id,
            email,
            password: hashedPassword,
            name,
            tel: tel ? tel.toString() : undefined, // 문자열로 저장
            ad_yn,
            pri_yn,
            type,
            birth,
            profileComplete: false
        });

        await newUser.save();

        // JWT 토큰 생성
        const accessToken = jwt.sign(
            {
                user_id: newUser.user_id,
                email: newUser.email,
                issuer: 'mungpick',
            },
            SECRET_KEY,
            {
                expiresIn: '24h'
            }
        );

        // 응답 데이터 (비밀번호 제외)
        const userResponse = {
            user_id: newUser.user_id,
            email: newUser.email,
            name: newUser.name,
            tel: newUser.tel,
            ad_yn: newUser.ad_yn,
            pri_yn: newUser.pri_yn,
            type: newUser.type,
            birth: newUser.birth,
            profileComplete: newUser.profileComplete,
            createdAt: newUser.createdAt
        };

        res.status(201).json({
            success: true,
            message: "회원가입이 완료되었습니다!",
            accessToken: accessToken,
            user: userResponse
        });

    } catch (error) {
        console.error("회원가입 오류:", error);
        res.status(500).json({
            success: false,
            message: "회원가입 중 오류가 발생했습니다."
        });
    }
};

// 로컬 로그인 전략
export const localStrategy = async (req, res, next) => {
    const error = req.error; // 오류
    const authenticatedUser = req.user; // 인증된 유저
    const info = req.info;
    console.log("authenticatedUser", authenticatedUser)

    if(error || !authenticatedUser){
        return res.status(400).json({message: info.message})
    }
    
    // jwt토큰을 발급 해주자!
    req.login(authenticatedUser, {session : false}, async (loginError) => {
        if(loginError) {
            return res.status(400).json({message : "알 수 없는 오류 발생!"})
        }

        // jwt.sign(토큰에 담을 정보, 시크릿 키, 옵션)
        const accessToken = jwt.sign(
            {
                user_id : authenticatedUser.user_id,
                issuer : 'mungpick',
            },
            SECRET_KEY,
            {
                expiresIn : '24h'
            }
        )

        // 비밀번호 제외하고 사용자 정보 반환
        const { password: _, ...currentUser } = authenticatedUser;

        return res.status(200).json({
            loginSuccess: true,
            currentUser: currentUser,
            isLogin: true,
            accessToken: accessToken,
            message: "로그인 완료!"
        })
    })
}

// jwt 토큰 전략
export const jwtStrategy = async (req, res, next) => {
    try {
        const jwtAuthenticatedUser = req.user;
        const {password, ...user} = jwtAuthenticatedUser;
    
        res.status(200).json({
            message : "자동 로그인 성공",
            user: user
        })
    } catch (error) {
        console.log("authController jwtStrategy error")
        console.error(error)
        next(error)
    }
}