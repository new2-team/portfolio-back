import express from "express";
import { index } from "../controllers/index.js";
import calendarRoutes from "./calendar/calendarRoutes.js";
import chatRoutes from "./chatting/chatRoutes.js";
import userRouter from "./user/userRoutes.js";  
import inquiryRoutes from "./inquiry/inquiryRoutes.js";

const rootRouter = express.Router()

rootRouter.get("/", index)
rootRouter.use("/users", userRouter)  
rootRouter.use("/calender/api", calendarRoutes)
rootRouter.use("/chatting/api", chatRoutes)
rootRouter.use("/inquiry/api", inquiryRoutes)

export default rootRouter;