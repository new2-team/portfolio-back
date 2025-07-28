import express from "express";
import { index } from "../controller/index.js";
import calendarRoutes from "./calendarRoutes.js";
import chatRoutes from "./chatRoutes.js";
import todoRouter from "./todo/todoRouter.js";
import userRouter from "./user/userRouter.js";


const rootRouter = express.Router()

rootRouter.get("/", index)
rootRouter.use("/todos/api", todoRouter)
rootRouter.use("/users/api", userRouter)
rootRouter.use("/calendar/api", calendarRoutes)
rootRouter.use("/chatting/api", chatRoutes)

export default rootRouter;