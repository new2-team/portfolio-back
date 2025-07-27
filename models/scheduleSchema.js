import { Schema, model } from "mongoose";
import { getCurrentTime } from "../utils/utils.js";

const scheduleSchema = new Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  place: { type: String, required: true },
  diary_text: { type: String },
  diary_photo_url: { type: String },
  createdAt: { type: String, default: getCurrentTime },
  updatedAt: { type: String, default: getCurrentTime },
});


export default model("Schedule", scheduleSchema, "schedule");
