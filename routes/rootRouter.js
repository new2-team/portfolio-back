import express from "express";
import { index } from "../controllers/index.js";
import calendarRoutes from "./calendar/calendarRoutes.js";
import chatRoutes from "./chatting/chatRoutes.js";
import userRouter from "./user/userRoutes.js";  
import communityRoutes from "./community/communityRoutes.js";

const rootRouter = express.Router()

rootRouter.get("/", index)
rootRouter.use("/users", userRouter)  
rootRouter.use("/calender/api", calendarRoutes)
rootRouter.use("/chatting/api", chatRoutes)
rootRouter.use("/community", communityRoutes)

export default rootRouter;