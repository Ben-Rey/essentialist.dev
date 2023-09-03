import { Request, Response } from "express";
import { exclude } from "../../prisma/helpers";
import { ZodError } from "zod";
import { createUserSchema } from "../../schemas/user/userSchema";
import { createNewUser, findMany } from "../../models/user";
import {
  success,
  internalError,
  userNameTaken,
  validationError,
  emailAlreadyInUse,
} from "../../constant/responses";

export async function createUser(req: Request, res: Response) {
  try {
    const { username, email } = createUserSchema.parse(req.body);

    const userList = await findMany([{ email }, { username }]);

    if (userList && userList[0].email === email) {
      return res.status(emailAlreadyInUse.status).json(emailAlreadyInUse.data);
    }

    if (userList && userList[0]?.username === username) {
      return res.status(userNameTaken.status).json(userNameTaken.data);
    }

    const createdUser = await createNewUser({
      ...req.body,
      password: generateRandomPassword(),
    });

    return res
      .status(201)
      .json(success.data(exclude(createdUser, ["password"])));
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(validationError.status).json(validationError.data);
    }

    console.log("internal error", error);
    return res.status(internalError.status).json(internalError.data);
  }
}

function generateRandomPassword(): string {
  return Math.random().toString(36).slice(-8);
}
