import { Schema, model } from "mongoose";
import { getCurrentTime } from "../utils/utils.js";

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

// 강아지 프로필을 포함한 사용자 스키마
const userSchema = new Schema({
  userId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  birthday: { type: String, required: true },
  email: { type: String },
  profileComplete: { type: Boolean, default: false },
  dogProfile: {
      name: String,
      weight: String,
      birthDate: String,
      gender: String,
      address: String,
      breed: String,
      custombreed: String,
      nickname: String,
      favoriteSnack: String,
      walkingCourse: String,
      messageToFriend: String,
      charactor: Number,
      favorites: [Number],
      cautions: [Number],
      neutralization: String,
      profileImage: String
  },
  createdAt: { type: Date, default: Date.now }
});


// model("객체명", 스키마, "컬렉션(테이블명)")
export default model("User", userSchema, "user")