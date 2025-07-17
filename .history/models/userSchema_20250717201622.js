import { Schema, model } from "mongoose";
import { getCurrentTime } from "../utils/utils.js";

const userSchema = new Schema({
  email: { type: String, require: true, unique: true },
  password: String,
  name: String,
  age: { type: Number, default: 0 },
  phone: { type: String, default: "010-0000-0000"},
  picture: { type: String, default: "none_picture.jpg" },
  picturePath: { type: String, default: "/default/" },
  token: String,
  provider: { type: String, default: "local" },
  createdAt: { type: String, default: getCurrentTime },
  updatedAt: { type: String, default: getCurrentTime },
});

export default model("User", userSchema, "user")