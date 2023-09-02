// import { PrismaClient } from "@prisma/client";
import prisma from "../../prisma/prisma";
import { Request, Response } from "express";
import { ZodError, z } from "zod";
import {
  internalError,
  userNotFound,
  validationError,
} from "../../constant/responses";

const getUserSchema = z.object({
  email: z.string().email(),
});

interface QueryParams {
  email: string;
}

export async function getUser(
  req: Request<{}, {}, {}, QueryParams>,
  res: Response
) {
  try {
    const { email } = getUserSchema.parse(req.query);

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(userNotFound.status).json(userNotFound.data);
    }

    res.json({
      error: undefined,
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      success: true,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(validationError.status).json(validationError.data);
    }

    return res.status(internalError.status).json(internalError.data);
  }
}
