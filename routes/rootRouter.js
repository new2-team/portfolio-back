import express from "express";
import { index } from "../controllers/index.js";
import authRouter from "./auth/authRouter.js";
import calendarRoutes from "./calendar/calendarRoutes.js";
import chatRoutes from "./chatting/chatRoutes.js";
import communityRoutes from "./community/communityRoutes.js";
import imagesRouter from "./images/imagesRouter.js";
import userRouter from "./user/userRoutes.js";

const rootRouter = express.Router()

rootRouter.get("/", index)
rootRouter.use("/auth", authRouter)
rootRouter.use("/users", userRouter)  
rootRouter.use("/calendar/api", calendarRoutes)
rootRouter.use("/images", imagesRouter)
rootRouter.use("/chatting/api", chatRoutes)
rootRouter.use("/community", communityRoutes)

export default rootRouter;