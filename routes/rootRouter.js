import express from "express"
import { index } from "../controller/index.js";
import todoRouter from "./todo/todoRouter.js";
import userRouter from "./user/userRouter.js";

const rootRouter = express.Router()

rootRouter.get("/", index)
rootRouter.use("/todos/api", todoRouter)
rootRouter.use("/users/api", userRouter)

export default rootRouter;