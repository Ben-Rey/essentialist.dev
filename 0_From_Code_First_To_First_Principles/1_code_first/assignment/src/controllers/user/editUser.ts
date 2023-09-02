import prisma from "../../prisma/prisma";
import { Request, Response } from "express";
import { ZodError, z } from "zod";
import { exclude } from "../../prisma/helpers";
import {
  emailAlreadyInUse,
  internalError,
  userNameTaken,
  userNotFound,
  validationError,
} from "../../constant/responses";

const editUserSchema = z.object({
  username: z.string().optional(),
  email: z.string().email().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

export async function editUser(req: Request, res: Response) {
  const { userId } = req.params;
  try {
    const { username, email, firstName, lastName } = editUserSchema.parse(
      req.body
    );

    const user = await await prisma.user.findUnique({
      where: {
        id: parseInt(userId),
      },
    });

    if (!user) {
      return res.status(userNotFound.status).json(userNotFound.data);
    }
    if (user.username === username) {
      return res.status(userNameTaken.status).json(userNameTaken.data);
    }
    if (user.email === email) {
      return res.status(emailAlreadyInUse.status).json(emailAlreadyInUse.data);
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: parseInt(userId),
      },
      data: {
        username,
        email,
        firstName,
        lastName,
      },
      select: {
        password: false,
      },
    });

    res.json({
      error: undefined,
      data: exclude(updatedUser, ["password"]),
      success: true,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(validationError.status).json(validationError.data);
    } else {
      return res.status(internalError.status).json(internalError.data);
    }
  }
}
