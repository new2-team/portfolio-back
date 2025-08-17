// 스키마 생성시, 선언 가능 타입
// String: 문자열로 선언
// Number: 숫자로 선언
// Date: 날짜 타입으로 선언
// Boolean: 불린으로 선언
// Mixed: 무엇이든 가능한 타입으로 선언
// ObjectId: 다른 스키마를 참조할 때 선언(속성 중, ref와 같이 사용)
// Array: [] 기호를 사용해 선언, { names: [String] }

// 스키마 생성시, 추가 속성
// required: boolean, 해당 속성이 필수인지 여부
// default: 기본값 설정
// validate: function, 유효성 검증 함수 추가, 리턴은 boolean타입
// immutable: boolean, true로 설정 시 값을 변경할 수 없음
// unique: boolean, 해당 속성에 유니크(중복없음)와 인덱스(조회 성능 향상)를 정의할지 여부
// timestamps: boolean, 작성 날짜와 수정 날짜가 자동으로 추가된다.
// ref: string, 참조할 스키마이름을 작성하면, 해당 스키마의 ObjectId를 담을 수 있다.


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
        required: true,
        description: "회원 비밀번호"
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
        enum: ['i', 'k', 'n'],
        default: 'i',
        description: "회원타입 (i: 일반회원, k: 카카오회원, n: 네이버회원)"
    },
    birth: {
        type: String,
        description: "회원 생년월일 (YYYY-MM-DD 형식)"
    },
    
    // 강아지 관련 정보 (선택사항)
    mbti: {
        type: String,
        description: "강아지 엠비티아이 (선택사항)"
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
        vaccine: [String], // 예방접종 이력 (배열)
        hospital: String, // 병원 이름
        visitCycle: String, // 방문 주기
        lastVisit: String, // 마지막 방문일 (YYYY-MM-DD 형식)
        allergyCause: String, // 알러지 원인
        allergySymptom: {
            type: Number,
            required: false 
        }
    }
}, {
    timestamps: true // 생성일시, 수정일시 자동 추가
});

// User 모델 생성
const User = model("User", userSchema);

// User 모델 export
export default User;


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