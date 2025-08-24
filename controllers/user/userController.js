import User from "../../models/userSchema.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

// 1단계: 기본 회원가입 - DB에 저장하지 않고 임시 데이터만 반환
export const registerUser = async (req, res) => {
    try {
        console.log('받은 요청 데이터:', req.body);
        console.log('user_id:', req.body.user_id);
        console.log('password:', req.body.password);
        console.log('name:', req.body.name);
        console.log('tel:', req.body.tel);
        console.log('birth:', req.body.birth);
        console.log('email:', req.body.email);
        const { user_id, password, name, tel, birth, email, ad_yn = false, pri_yn = true, type = 'i' } = req.body;
        
        // 필수 필드 검증
        if (!user_id || !password || !name) {
            return res.status(400).json({
                registerStatus: false,
                message: "필수 정보가 누락되었습니다. (user_id, password, name)"
            });
        }
        
        // 비밀번호 길이 검증 (최소 6자)
        if (password.length < 6) {
            return res.status(400).json({
                registerStatus: false,
                message: "비밀번호는 최소 6자 이상이어야 합니다."
            });
        }
        
        // 1. user_id 중복 확인
        const foundUser = await User.findOne({ user_id: user_id }).lean();
        
        if (foundUser) {
            return res.status(409).json({
                registerStatus: false,
                message: "이미 존재하는 사용자 ID입니다."
            });
        }
        
        // 2. 이메일이 제공된 경우 중복 확인
        if (email) {
            const foundEmail = await User.findOne({ email: email }).lean();
            
            if (foundEmail) {
                return res.status(409).json({
                    registerStatus: false,
                    message: "이미 존재하는 이메일입니다."
                });
            }
        }
        
        // DB에 저장하지 않고 성공 응답만 반환
        res.status(200).json({
            registerSuccess: true,
            message: "기본 정보 입력 완료. 다음 단계로 진행해주세요.",
            tempData: {
                user_id: user_id,
                password: password,
                name: name,
                tel: tel,
                birth: birth,
                email: email,
                ad_yn: ad_yn,
                pri_yn: pri_yn,
                type: type
            }
        });
        
    } catch (error) {
        console.error("회원가입 오류:", error);
        res.status(500).json({
            registerStatus: false,
            message: "회원가입 중 오류가 발생했습니다."
        });
    }
};

// 2단계: 프로필 등록 - DB에 저장하지 않고 임시 데이터만 반환
export const profileRegistration = async (req, res) => {
    try {
        const { userId, name, weight, birthDate, gender, address, breed, custombreed, 
                nickname, favoriteSnack, walkingCourse, messageToFriend, 
                charactor, favorites, cautions, neutralization } = req.body;
        
        // 프로필 이미지 처리 (multer 미들웨어 필요)
        const profileImage = req.file;
        
        // 프로필 이미지가 있으면 경로 저장
        let profileImagePath = null;
        if (profileImage) {
            profileImagePath = `/uploads/profile/${profileImage.filename}`;
        }
        
        // DB에 저장하지 않고 성공 응답만 반환
        res.status(200).json({
            profileStatus: true,
            message: "프로필 정보 입력 완료. 다음 단계로 진행해주세요.",
            tempData: {
                dogProfile: {
                    name: name,
                    weight: weight,
                    birthDate: birthDate ? new Date(birthDate).toISOString().split('T')[0] : undefined,
                    gender: gender,
                    address: address,
                    breed: breed,
                    custombreed: custombreed,
                    nickname: nickname,
                    favoriteSnack: favoriteSnack,
                    walkingCourse: walkingCourse,
                    messageToFriend: messageToFriend,
                    charactor: charactor,        
                    favorites: favorites,         
                    cautions: cautions,  
                    neutralization: neutralization,
                    profileImage: profileImagePath
                }
            }
        });
        
    } catch (error) {
        console.error("프로필 등록 오류:", error);
        res.status(500).json({
            profileStatus: false,
            message: "프로필 등록 중 오류가 발생했습니다."
        });
    }
};

// 최종 단계: 모든 정보를 한번에 DB에 저장
export const completeRegistration = async (req, res) => {
    try {
        const { 
            // 1단계 데이터
            user_id, password, name, tel, birth, email, ad_yn, pri_yn, type, isSocialLogin,
            // 2단계 데이터  
            dogProfile,
            // 3단계 데이터
            healthProfile
        } = req.body;
        
        // 필수 필드 검증 (소셜 로그인 사용자는 password가 없을 수 있음)
        if (!user_id || !name || !dogProfile) {
            return res.status(400).json({
                success: false,
                message: "필수 정보가 누락되었습니다."
            });
        }
        
        // type 필드를 스키마에 맞게 정규화
        let normalizedType = type;
        if (type === 'i' || type === 'regular' || type === 'google') {
            normalizedType = 'general'; // 일반회원
        } else if (type === 'k' || type === 'kakao') {
            normalizedType = 'social'; // 소셜회원 (카카오)
        } else if (type === 'n' || type === 'naver') {
            normalizedType = 'social'; // 소셜회원 (네이버)
        } else if (!['general', 'social'].includes(type)) {
            normalizedType = 'general'; // 기본값
        }
        
        console.log('=== type 필드 정규화 결과 ===');
        console.log('원본 type:', type);
        console.log('정규화된 type:', normalizedType);
        console.log('password 존재 여부:', !!password);
        
        // 일반 회원가입인 경우에만 password 필수
        if (normalizedType === 'general' && !password) {
            return res.status(400).json({
                success: false,
                message: "일반 회원가입의 경우 비밀번호가 필요합니다."
            });
        }
        
        // 1. user_id 중복 확인 (최종 확인)
        const foundUser = await User.findOne({ user_id: user_id }).lean();
        
        if (foundUser) {
            return res.status(409).json({
                success: false,
                message: "이미 존재하는 사용자 ID입니다."
            });
        }
        
        // 2. 이메일이 제공된 경우 중복 확인
        if (email) {
            const foundEmail = await User.findOne({ email: email }).lean();
            
            if (foundEmail) {
                return res.status(409).json({
                    success: false,
                    message: "이미 존재하는 이메일입니다."
                });
            }
        }
        
        // 트랜잭션 시작
        const session = await mongoose.startSession();
        session.startTransaction();
        
        try {
            // 4. 모든 정보를 한번에 저장
            const userData = {
                user_id: user_id,
                name: name,
                tel: tel ? parseInt(tel) : undefined,
                birth: birth ? new Date(birth).toISOString().split('T')[0] : undefined,
                email: email,
                ad_yn: ad_yn || false,
                pri_yn: pri_yn !== undefined ? pri_yn : true,
                type: normalizedType, // 정규화된 type 사용
                profileComplete: true,
                dogProfile: dogProfile,
                healthProfile: healthProfile || {}
            };
            
            // 일반 회원가입인 경우에만 비밀번호 암호화하여 추가
            if (normalizedType === 'general' && password) {
                const saltRounds = 10;
                const hashedPassword = await bcrypt.hash(password, saltRounds);
                userData.password = hashedPassword;
            }
            
            const newUser = await User.create([userData], { session });
            
            // 트랜잭션 커밋
            await session.commitTransaction();
            
            res.status(201).json({
                success: true,
                message: "회원가입이 완료되었습니다!",
                user: {
                    user_id: newUser[0].user_id,
                    name: newUser[0].name,
                    profileComplete: newUser[0].profileComplete
                }
            });
            
        } catch (error) {
            // 트랜잭션 롤백
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
        
    } catch (error) {
        console.error("회원가입 완료 오류:", error);
        res.status(500).json({
            success: false,
            message: "회원가입 완료 중 오류가 발생했습니다."
        });
    }
};

// 로그인 (user_id 기반으로 수정)
export const loginUser = async (req, res) => {
    try {
        const { user_id, password } = req.body;
        
        // 1. user_id 존재 확인
        const foundUser = await User.findOne({ user_id: user_id }).lean();
        
        if (!foundUser) {
            return res.status(404).json({
                loginSuccess: false,
                message: "존재하지 않는 아이디입니다."
            });
        }
        
        // 2. 비밀번호 확인
        const isPasswordValid = await bcrypt.compare(password, foundUser.password);
        
        if (!isPasswordValid) {
            return res.status(401).json({
                loginSuccess: false,
                message: "비밀번호가 일치하지 않습니다."
            });
        }

        // jwt 토큰 생성
        const accessToken = jwt.sign(
            {
                user_id: foundUser.user_id,
                issuer: 'mungpick',
            },
            process.env.SECRET_KEY, // .env 파일에서 SECRET_KEY 사용
            {
                expiresIn: '24h'
            }
        );
        
        // 3. 로그인 성공 - 비밀번호 제외하고 반환
        const { password: _, ...currentUser } = foundUser;
        
        res.status(200).json({
            loginSuccess: true,
            currentUser: currentUser,
            isLogin: true,
            message: "로그인 완료!"
        });
        
    } catch (error) {
        console.error("로그인 오류:", error);
        res.status(500).json({
            loginSuccess: false,
            message: "로그인 중 오류가 발생했습니다."
        });
    }
};

// 특정 회원 정보 업데이트
export const modifyUser = async (req, res) => {
    try {
        const { user_id } = req.params; // URL 파라미터에서 user_id 가져오기
        const updateData = req.body;

        // 업데이트할 수 있는 필드들만 허용
        const allowedFields = ['name', 'tel', 'birth', 'email', 'ad_yn', 'pri_yn'];
        const filteredData = {};

        allowedFields.forEach(field => {
            if (updateData[field] !== undefined) {
                filteredData[field] = updateData[field];
            }
        });

        // 날짜 형식 처리
        if (filteredData.birth) {
            filteredData.birth = new Date(filteredData.birth).toISOString().split('T')[0];
        }

        const updatedUser = await User.findOneAndUpdate(
            { user_id: user_id },
            filteredData,
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "존재하지 않는 사용자입니다."
            });
        }

        res.status(200).json({
            success: true,
            message: "회원정보 수정이 완료되었습니다!",
            user: {
                user_id: updatedUser.user_id,
                name: updatedUser.name,
                email: updatedUser.email,
                tel: updatedUser.tel,
                birth: updatedUser.birth,
                ad_yn: updatedUser.ad_yn,
                pri_yn: updatedUser.pri_yn,
                updatedAt: updatedUser.updatedAt
            }
        });

    } catch (error) {
        console.error("회원정보 수정 오류:", error);
        res.status(500).json({
            success: false,
            message: "회원정보 수정 중 오류가 발생했습니다."
        });
    }
};

// 특정 회원 삭제
export const removeUser = async (req, res) => {
    try {
        const { user_id } = req.params; // URL 파라미터에서 user_id 가져오기

        const deletedUser = await User.findOneAndDelete({ user_id: user_id });

        if (!deletedUser) {
            return res.status(404).json({
                success: false,
                message: "존재하지 않는 사용자입니다."
            });
        }

        res.status(200).json({
            success: true,
            message: "회원이 성공적으로 삭제되었습니다.",
            deletedUser: {
                user_id: deletedUser.user_id,
                name: deletedUser.name,
                email: deletedUser.email
            }
        });

    } catch (error) {
        console.error("회원 삭제 오류:", error);
        res.status(500).json({
            success: false,
            message: "회원 삭제 중 오류가 발생했습니다."
        });
    }
};

// 모든 회원 조회
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, {
            password: 0, // 비밀번호는 제외
            __v: 0
        }).lean();

        res.status(200).json({
            success: true,
            message: "회원 목록을 성공적으로 조회했습니다.",
            totalCount: users.length,
            users: users
        });

    } catch (error) {
        console.error("회원 목록 조회 오류:", error);
        res.status(500).json({
            success: false,
            message: "회원 목록 조회 중 오류가 발생했습니다."
        });
    }
};

// 특정 회원 조회
export const getUserById = async (req, res) => {
    try {
        const { user_id } = req.params;

        const user = await User.findOne({ user_id: user_id }, {
            password: 0, // 비밀번호는 제외
            __v: 0
        }).lean();

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "회원 정보를 찾을 수 없습니다."
            });
        }

        res.status(200).json({
            success: true,
            message: "회원 정보를 성공적으로 조회했습니다.",
            user: user
        });

    } catch (error) {
        console.error("회원 조회 오류:", error);
        res.status(500).json({
            success: false,
            message: "회원 조회 중 오류가 발생했습니다."
        });
    }
};

// 전체 회원 삭제 (관리자용)
export const deleteAllUsers = async (req, res) => {
    try {
        const result = await User.deleteMany({});
        
        res.status(200).json({
            success: true,
            message: "모든 회원이 성공적으로 삭제되었습니다.",
            deletedCount: result.deletedCount
        });

    } catch (error) {
        console.error("전체 회원 삭제 오류:", error);
        res.status(500).json({
            success: false,
            message: "전체 회원 삭제 중 오류가 발생했습니다."
        });
    }
};

export const modifyPicture = (req, res) => {
    res.status(200).json({message : "썸네일 이미지 변경 완료!"});
};

// 건강정보 등록 - 기존 함수는 유지 (이미 가입된 사용자용)
export const healthRegistration = async (req, res) => {
    try {
        const { userId, vaccine, hospital, visitCycle, lastVisit, allergyCause, allergySymptom } = req.body;
        
        // 사용자 존재 확인
        const foundUser = await User.findOne({ user_id: userId });
        
        if (!foundUser) {
            return res.status(404).json({
                success: false,
                message: "존재하지 않는 사용자입니다."
            });
        }
        
        // 건강정보 업데이트
        const healthData = {
            healthProfile: {
                vaccine: Array.isArray(vaccine) ? vaccine : JSON.parse(vaccine || '[]'),
                hospital: hospital,
                visitCycle: visitCycle,
                lastVisit: lastVisit ? new Date(lastVisit).toISOString().split('T')[0] : undefined,
                allergyCause: allergyCause,
                allergySymptom: allergySymptom ? parseInt(allergySymptom) : undefined
            }
        };
        
        const updatedUser = await User.findOneAndUpdate(
            { user_id: userId },
            healthData,
            { new: true }
        );
        
        res.status(200).json({
            success: true,
            message: "건강정보 등록이 완료되었습니다!",
            user: {
                user_id: updatedUser.user_id,
                healthProfile: updatedUser.healthProfile
            }
        });
        
    } catch (error) {
        console.error("건강정보 등록 오류:", error);
        res.status(500).json({
            success: false,
            message: "건강정보 등록 중 오류가 발생했습니다."
        });
    }
};

// 아이디 중복확인
export const checkUserId = async (req, res) => {
    try {
        const { user_id } = req.body;
        
        if (!user_id) {
            return res.status(400).json({
                success: false,
                message: "아이디를 입력해주세요."
            });
        }
        
        // 아이디 형식 검증
        const userIdRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9]{6,}$/;
        if (!userIdRegex.test(user_id)) {
            return res.status(400).json({
                success: false,
                message: "영문과 숫자를 포함한 6자리 이상으로 입력해주세요."
            });
        }
        
        // 아이디 중복 확인
        const foundUser = await User.findOne({ user_id: user_id }).lean();
        
        if (foundUser) {
            return res.status(409).json({
                success: false,
                message: "이미 사용 중인 아이디입니다."
            });
        }
        
        res.status(200).json({
            success: true,
            message: "사용 가능한 아이디입니다."
        });
        
    } catch (error) {
        console.error("아이디 중복확인 오류:", error);
        res.status(500).json({
            success: false,
            message: "중복확인 중 오류가 발생했습니다."
        });
    }
};

// 소셜 로그인 사용자용 회원정보 입력 (password 불필요)
export const socialUserInfoRegistration = async (req, res) => {
    try {
        console.log('소셜 로그인 사용자 회원정보 입력 - 받은 요청 데이터:', req.body);
        const { user_id, name, tel, birth, email, ad_yn = false, pri_yn = true, type, isSocialLogin } = req.body;
        
        // 소셜 로그인 사용자인지 확인
        if (!isSocialLogin) {
            return res.status(400).json({
                registerStatus: false,
                message: "소셜 로그인 사용자만 사용할 수 있는 API입니다."
            });
        }
        
        // 필수 필드 검증 (password 제외)
        if (!name || !tel || !birth || !email) {
            return res.status(400).json({
                registerStatus: false,
                message: "필수 정보가 누락되었습니다. (이름, 휴대폰 번호, 생년월일, 이메일)"
            });
        }
        
        // 1. user_id 중복 확인 (소셜 로그인은 스킵 가능)
        if (user_id) {
            const foundUser = await User.findOne({ user_id: user_id }).lean();
            
            if (foundUser) {
                return res.status(409).json({
                    registerStatus: false,
                    message: "이미 존재하는 사용자 ID입니다."
                });
            }
        }
        
        // 2. 이메일 중복 확인
        const foundEmail = await User.findOne({ email: email }).lean();
        
        if (foundEmail) {
            return res.status(409).json({
                registerStatus: false,
                message: "이미 존재하는 이메일입니다."
            });
        }
        
        // DB에 저장하지 않고 성공 응답만 반환
        res.status(200).json({
            registerSuccess: true,
            message: "소셜 로그인 사용자 정보 입력 완료. 다음 단계로 진행해주세요.",
            tempData: {
                user_id: user_id || `social_${Date.now()}`,
                name: name,
                tel: tel,
                birth: birth,
                email: email,
                ad_yn: ad_yn,
                pri_yn: pri_yn,
                type: type || 'k', // 소셜 로그인 기본값
                isSocialLogin: true
            }
        });
        
    } catch (error) {
        console.error("소셜 로그인 사용자 회원정보 입력 오류:", error);
        res.status(500).json({
            registerStatus: false,
            message: "회원정보 입력 중 오류가 발생했습니다."
        });
    }
};