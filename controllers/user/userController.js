import User from "../../models/userSchema.js";
import bcrypt from "bcrypt";

// 2단계: 회원정보 입력 (기본 회원가입)
export const registerUser = async (req, res) => {
    try {
        const { userId, password, name, phone, birthday, email } = req.body;
        
        // 1. userId 중복 확인
        const foundUser = await User.findOne({ userId: userId }).lean();
        
        if (foundUser) {
            return res.status(409).json({
                registerStatus: false,
                message: "이미 존재하는 아이디입니다."
            });
        }
        
        // 2. 비밀번호 암호화
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        // 3. 기본 회원 정보 저장 (프로필은 아직 미완성 상태)
        const newUser = await User.create({
            userId: userId,
            password: hashedPassword,
            name: name,
            phone: phone,
            birthday: birthday,
            email: email,
            profileComplete: false, // 프로필 등록 완료 여부
            createdAt: new Date()
        });
        
        res.status(201).json({
            registerSuccess: true,
            message: "기본 회원가입이 완료되었습니다. 프로필을 등록해주세요.",
            user: {
                userId: newUser.userId,
                name: newUser.name
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

// 3단계: 프로필 등록 (강아지 프로필)
export const profileRegistration = async (req, res) => {
    try {
        const { userId, name, weight, birthDate, gender, address, breed, custombreed, 
                nickname, favoriteSnack, walkingCourse, messageToFriend, 
                charactor, favorites, cautions, neutralization } = req.body;
        
        // 프로필 이미지 처리 (multer 미들웨어 필요)
        const profileImage = req.file;
        
        // 1. 사용자 존재 확인
        const foundUser = await User.findOne({ userId: userId });
        
        if (!foundUser) {
            return res.status(404).json({
                profileStatus: false,
                message: "존재하지 않는 사용자입니다."
            });
        }
        
        // 2. 프로필 정보 업데이트
        const profileData = {
            profileComplete: true,
            dogProfile: {
                name: name,
                weight: weight,
                birthDate: birthDate,
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
                neutralization: neutralization
            }
        };
        
        // 프로필 이미지가 있으면 경로 저장
        if (profileImage) {
            profileData.dogProfile.profileImage = profileImage.path;
        }
        
        const updatedUser = await User.findOneAndUpdate(
            { userId: userId },
            profileData,
            { new: true }
        );
        
        res.status(200).json({
            profileStatus: true,
            message: "프로필 등록이 완료되었습니다!",
            user: {
                userId: updatedUser.userId,
                name: updatedUser.name,
                profileComplete: updatedUser.profileComplete,
                dogProfile: updatedUser.dogProfile
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

// 로그인 (userId 기반으로 수정)
export const loginUser = async (req, res) => {
    try {
        const { userId, password } = req.body;
        
        // 1. userId 존재 확인
        const foundUser = await User.findOne({ userId: userId }).lean();
        
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

// 기존 함수들...
export const modifyUser = (req, res) => {
    res.status(200).json({message : "회원정보 수정 완료!"});
};

export const removeUser = (req, res) => {
    res.status(200).json({message : "회원 탈퇴 완료!"});
};

export const modifyPicture = (req, res) => {
    res.status(200).json({message : "썸네일 이미지 변경 완료!"});
};