import { Schema, model } from "mongoose";
import { getCurrentTime } from "../utils/utils.js";

const inquiryReplySchema = new Schema({
 replyId : { type: String, required: true, unique: true }, // 답변 id
 inquiryId : { type: String, required: true }, // 문의글 id
 userId : { type: String, required: true }, // 회원 id
 replyContent : { type: String, required: true }, // 답변 내용
 createdAt : { type: Date, default: getCurrentTime } // 생성 시간
});

export default model("InquiryReply", inquiryReplySchema, "inquiryReply")