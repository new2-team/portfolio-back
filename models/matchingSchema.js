// 테스트를 위해 임시로 만들었어요 !!
import { Schema, model } from "mongoose";

const matchingSchema = new Schema({
  match_id: { type: Number, required: true },     // 매칭 ID (임시 PK)
  user_id: { type: String, required: true },      // 매칭 요청한 회원
  target_id: { type: String, required: true },    // 매칭 받은 회원

  // 1: 매칭완료, 0: 매칭중, 2: 거절, 3: 취소
  status: { type: Number, enum: [0, 1, 2, 3], required: true },
});

export default model("Matching", matchingSchema, "matching");
