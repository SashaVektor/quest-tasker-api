import express from "express"
import { editUserInfo, signIn, signUp } from "../controllers/userController.js";
import { isAuth } from "../utils.js";

const userRouter = express.Router();

userRouter.post("/signup", signUp)

userRouter.post("/signin", signIn)

userRouter.patch("/:id", isAuth , editUserInfo)

export default userRouter