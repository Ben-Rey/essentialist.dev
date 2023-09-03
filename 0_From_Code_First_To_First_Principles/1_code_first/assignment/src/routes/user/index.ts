import express from "express";
import { createUser, editUser, getUser } from "../../controllers/user";

const userRouter = express.Router();

userRouter.get("/", getUser);
userRouter.post("/new", createUser);
userRouter.post("/edit/:userId", editUser);

export default userRouter;
