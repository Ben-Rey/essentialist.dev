import { Request, Response } from "express";
import { exclude } from "../../prisma/helpers";
import { ZodError } from "zod";
import { getUserSchema } from "../../schemas/user/userSchema";
import {
  success,
  userNotFound,
  internalError,
  validationError,
} from "../../constant/responses";
import { findUnique } from "../../models/user";

interface QueryParams {
  email: string;
}

export async function getUser(
  req: Request<{}, {}, {}, QueryParams>,
  res: Response
) {
  try {
    const { email } = getUserSchema.parse(req.query);

    const user = await findUnique("email", email);

    if (!user) {
      return res.status(userNotFound.status).json(userNotFound.data);
    }

    res.json(success.data(exclude(user, ["password"])));
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(validationError.status).json(validationError.data);
    }

    console.log("internal error", error);
    return res.status(internalError.status).json(internalError.data);
  }
}
