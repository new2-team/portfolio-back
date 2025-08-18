import { Schema, model } from "mongoose"
import { getCurrentTime } from "../utils/utils.js"

const inquirySchema = new Schema ({
 inquiryId : { type: String, required: true, unique: true }, // 문의글 id
 userId : { type: String, required: true, unique: true }, // 회원 id
 inquiryType : { type: String, required: true }, // 문의 유형
 title : { type: String, required: true }, // 문의글 제목
 content : { type: String, required: true }, // 문의글 내용
 file : { /*data: Buffer,*/ type: String }, // 첨부파일
 replyYN : { type: Boolean, default: false }, // 답변 여부
 createdAt : { type: Date, default: getCurrentTime } // 생성 시간
});

export default model("Inquiry", inquirySchema, "inquiry")