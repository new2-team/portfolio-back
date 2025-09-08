import { Schema, model } from "mongoose";
import { getCurrentTime } from "../utils/utils.js";

const scheduleSchema = new Schema({ 
  // schedule_id: { type: Schema.Types.ObjectId, auto: true },

  user_id: { type: String},                 // 나
  chat_id: { type: String },     // 채팅방 ID
  // target_id: { type: String },                               // 상대 회원 ID

  title: { type: String, required: true },                   // 제목
  date: { type: String },
  time: { type: String },
  location: { type: String },
  diary_text: { type: String },
  diary_photo_url: { type: String },
  createdAt: { type: String, default: getCurrentTime },
});

export default model("Schedule", scheduleSchema, "schedule");
