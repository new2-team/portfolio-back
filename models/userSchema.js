import mongoose from "mongoose";

const { Schema, model } = mongoose;

// User 스키마 정의 (ERD 기반)
const userSchema = new Schema({
    // 기본 회원 정보
    user_id: {
        type: String,
        required: true,
        unique: true,
        description: "회원 ID"
    },
    email: {
        type: String,
        required: false,
        description: "회원 이메일 (선택사항)"
    },
    password: {
        type: String,
        required: function() {
            // 일반회원(type: 'general')인 경우에만 비밀번호 필수
            return this.type === 'general';
        },
        description: "회원 비밀번호 (일반회원만 필수)"
    },
    // 소셜 로그인용 필드들
    googleId: {
        type: String,
        description: "구글 로그인 ID"
    },
    naverId: {
        type: String,
        description: "네이버 로그인 ID"
    },
    kakaoId: {
        type: String,
        description: "카카오 로그인 ID"
    },
    // 소셜 로그인 구분을 위한 필드 추가
    isSocialLogin: {
        type: Boolean,
        default: false,
        description: "소셜 로그인 여부"
    },
    provider: {
        type: String,
        enum: ['google', 'kakao', 'naver'],
        default: null,
        description: "소셜 로그인 제공자"
    },
    name: {
        type: String,
        required: true,
        description: "회원 이름"
    },
    tel: {
        type: Number,
        description: "회원 번호"
    },
    ad_yn: {
        type: Boolean,
        default: false,
        description: "마케팅동의 여부 (0: 동의안함, 1: 동의함)"
    },
    pri_yn: {
        type: Boolean,
        default: true,
        description: "개인정보 처리방침 동의 (0: 동의안함, 1: 동의함)"
    },
    type: {
        type: String,
        enum: ['general', 'social'],
        default: 'general',
        description: "회원타입 (general: 일반회원, social: 소셜회원)"
    },
    birth: {
        type: String,
        description: "회원 생년월일 (YYYY-MM-DD 형식)"
    },
    
    // 강아지 디비티아이 검사 결과 (선택사항)
    dogMbti: {
        isCompleted: {
            type: Boolean,
            default: false,
            description: "강아지 디비티아이 검사 완료 여부"
        },
        result: {
            type: String,
            default: null,
            description: "강아지 디비티아이 검사 결과 (예: ENFP, ISFJ 등)"
        },
    },
    
    // 프로필 완료 여부
    profileComplete: {
        type: Boolean,
        default: false,
        description: "프로필 등록 완료 여부"
    },
    
    // 강아지 프로필 정보
    dogProfile: {
        name: String,
        weight: String,
        birthDate: String, // YYYY-MM-DD 형식으로 저장
        gender: String,
        address: String,
        breed: String,
        custombreed: String,
        nickname: String,
        favoriteSnack: String,
        walkingCourse: String,
        messageToFriend: String,
        charactor: String, 
        favorites: [String], 
        cautions: [String], 
        neutralization: String,
        profileImage: String
    },
    
    // 건강정보 (새로 추가)
    healthProfile: {
        vaccine: [String],
        hospital: String,
        visitCycle: String,
        lastVisit: String,
        allergyCause: String,
        allergySymptom: [String]  
    }
}, {
    timestamps: true // 생성일시, 수정일시 자동 추가
});

// User 모델 생성 (컬렉션 이름을 "users"로 통일)
const User = model("User", userSchema, "users");

// User 모델 export
export default User;

// 강아지 디비티아이 검사 결과 업데이트 함수
export const updateDogMbti = async (req, res) => {
    try {
        const { userId, mbtiResult } = req.body;
        
        // 1. 사용자 존재 확인
        const foundUser = await User.findOne({ user_id: userId });
        
        if (!foundUser) {
            return res.status(404).json({
                success: false,
                message: "존재하지 않는 사용자입니다."
            });
        }
        
        // 2. 디비티아이 검사 결과 업데이트
        const updateData = {
            'dogMbti.isCompleted': true,
            'dogMbti.result': mbtiResult,
            'dogMbti.completedAt': new Date()
        };
        
        const updatedUser = await User.findOneAndUpdate(
            { user_id: userId },
            updateData,
            { new: true }
        );
        
        res.status(200).json({
            success: true,
            message: "강아지 디비티아이 검사 결과가 저장되었습니다!",
            dogMbti: updatedUser.dogMbti
        });
        
    } catch (error) {
        console.error("디비티아이 업데이트 오류:", error);
        res.status(500).json({
            success: false,
            message: "디비티아이 검사 결과 저장 중 오류가 발생했습니다."
        });
    }
};

// 강아지 디비티아이 검사 결과 조회 함수
export const getDogMbti = async (req, res) => {
    try {
        const { userId } = req.params;
        
        // 사용자 존재 확인
        const foundUser = await User.findOne({ user_id: userId });
        
        if (!foundUser) {
            return res.status(404).json({
                success: false,
                message: "존재하지 않는 사용자입니다."
            });
        }
        
        res.status(200).json({
            success: true,
            dogMbti: foundUser.dogMbti
        });
        
    } catch (error) {
        console.error("디비티아이 조회 오류:", error);
        res.status(500).json({
            success: false,
            message: "디비티아이 검사 결과 조회 중 오류가 발생했습니다."
        });
    }
};

// 이메일 중복확인 함수 추가
export const checkEmail = async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ 
                success: false, 
                message: "이메일을 입력해주세요." 
            });
        }
        
        // 이메일 형식 검증
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                success: false, 
                message: "올바른 이메일 형식이 아닙니다." 
            });
        }
        
        // 이메일로 기존 사용자 확인
        const existingUser = await User.findOne({ email: email });
        
        if (existingUser) {
            // 기존 사용자가 있는 경우
            return res.status(200).json({ 
                success: true,
                exists: true,
                isSocialLogin: existingUser.isSocialLogin || false,
                message: existingUser.isSocialLogin ? 
                    "이미 소셜 로그인으로 가입된 이메일입니다." : 
                    "이미 가입된 이메일입니다."
            });
        } else {
            // 사용 가능한 이메일
            return res.status(200).json({ 
                success: true,
                exists: false,
                message: "사용 가능한 이메일입니다."
            });
        }
        
    } catch (error) {
        console.error("이메일 중복확인 오류:", error);
        res.status(500).json({ 
            success: false, 
            message: "이메일 중복확인 중 오류가 발생했습니다." 
        });
    }
};

// 3단계: 프로필 등록 (강아지 프로필)
export const profileRegistration = async (req, res) => {
  try {
      const { userId, name, weight, birthDate, gender, address, breed, custombreed, 
              nickname, favoriteSnack, walkingCourse, messageToFriend, 
              charactor, favorites, cautions, neutralization } = req.body;
      
      // 프로필 이미지 처리 (multer 미들웨어로 업로드된 파일)
      const profileImage = req.file;
      
      // 1. 사용자 존재 확인 (user_id로 검색)
      const foundUser = await User.findOne({ user_id: userId });
      
      if (!foundUser) {
          return res.status(404).json({
              profileStatus: false,
              message: "존재하지 않는 사용자입니다."
          });
      }
      
      // 2. 프로필 정보 업데이트 (ERD 스키마에 맞게)
      const profileData = {
          profileComplete: true,
          // 강아지 관련 정보를 메인 필드에 저장
          name: name, // 강아지 이름
          weight: weight,
          birth: birthDate, // 강아지 생년월일
          gender: gender === 'male' ? true : false, // boolean으로 변환
          address: address,
          variaty: breed === '기타' ? custombreed : breed, // 품종
          nickname: nickname,
          snack_kind: favoriteSnack,
          introduce: messageToFriend,
          neut: neutralization === 'yes' ? true : false, // 중성화 여부
          // dogProfile도 유지 (기존 구조 호환성)
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
              charactor: parseInt(charactor),
              favorites: JSON.parse(favorites),
              cautions: JSON.parse(cautions),
              neutralization: neutralization
          }
      };
      
      // 프로필 이미지가 있으면 경로 저장
      if (profileImage) {
          profileData.profile_img = `/uploads/${profileImage.filename}`;
          profileData.dogProfile.profileImage = `/uploads/${profileImage.filename}`;
      }
      
      const updatedUser = await User.findOneAndUpdate(
          { user_id: userId },
          profileData,
          { new: true }
      );
      
      res.status(200).json({
          profileStatus: true,
          message: "프로필 등록이 완료되었습니다!",
          user: {
              user_id: updatedUser.user_id,
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
