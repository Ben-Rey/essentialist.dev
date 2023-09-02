import prisma from "../../prisma/prisma";
import { Request, Response } from "express";
import { z, ZodError } from "zod";
import {
  internalError,
  emailAlreadyInUse,
  userNameTaken,
  validationError,
} from "../../constant/responses";

const createUserSchema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
});

function generateRandomPassword(): string {
  return Math.random().toString(36).slice(-8);
}

export async function createUser(req: Request, res: Response) {
  try {
    const { username, email, firstName, lastName } = createUserSchema.parse(
      req.body
    );
    if (!username || !email || !firstName || !lastName) {
      return res
        .status(400)
        .json({ error: "ValidationError", data: undefined, success: false });
    }
    const user = await prisma.user.findMany({
      where: {
        OR: [{ email: email }, { username: username }],
      },
    });
    if (user) {
      if (user[0].email === email) {
        return res
          .status(emailAlreadyInUse.status)
          .json(emailAlreadyInUse.data);
      }
      if (user[0].username === username) {
        return res.status(userNameTaken.status).json(userNameTaken.data);
      }
    }
    const createdUser = await prisma.user.create({
      data: {
        username,
        email,
        firstName,
        lastName,
        password: generateRandomPassword(),
      },
    });
    return res.status(201).json({
      error: undefined,
      data: { id: createdUser.id, email, username, firstName, lastName },
      success: true,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(validationError.status).json(validationError.data);
    }
    return res.status(internalError.status).json(internalError.data);
  }
}
