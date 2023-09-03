import { Request, Response } from "express";
import { ZodError } from "zod";
import { exclude } from "../../prisma/helpers";
import { editUserSchema } from "../../schemas/user/userSchema";
import { findUnique, updateUserInfo } from "../../models/user";
import {
  success,
  userNotFound,
  internalError,
  userNameTaken,
  validationError,
  emailAlreadyInUse,
} from "../../constant/responses";

export async function editUser(req: Request, res: Response) {
  const { userId } = req.params;
  try {
    const { username, email } = editUserSchema.parse(req.body);

    const user = await findUnique("id", userId);

    if (!user) {
      return res.status(userNotFound.status).json(userNotFound.data);
    }
    if (user.username === username) {
      return res.status(userNameTaken.status).json(userNameTaken.data);
    }
    if (user.email === email) {
      return res.status(emailAlreadyInUse.status).json(emailAlreadyInUse.data);
    }

    const updatedUser = await updateUserInfo(userId, req.body);

    res.json(success.data(exclude(updatedUser, ["password"])));
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(validationError.status).json(validationError.data);
    }

    console.log("internal error", error);
    return res.status(internalError.status).json(internalError.data);
  }
}
