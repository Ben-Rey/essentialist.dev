import prisma from "../../prisma/prisma";
import { Request, Response } from "express";
import { ZodError, z } from "zod";
import { exclude } from "../../prisma/helpers";

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
    if (username) {
      const user = await prisma.user.findFirst({
        where: {
          username: username,
        },
      });
      if (user) {
        return res.status(409).json({
          error: "UsernameAlreadyTaken",
          data: undefined,
          success: false,
        });
      }
    }

    if (email) {
      const user = await prisma.user.findFirst({
        where: {
          email: email,
        },
      });
      if (user) {
        return res.status(409).json({
          error: "EmailAlreadyInUse",
          data: undefined,
          success: false,
        });
      }
    }

    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(userId),
      },
    });
    if (!user) {
      return res
        .status(404)
        .json({ error: "UserNotFound", data: undefined, success: false });
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
      res
        .status(400)
        .json({ error: "ValidationError", data: undefined, success: false });
    } else {
      res.status(500).json({
        error: "ServerError",
        data: undefined,
        success: false,
      });
    }
  }
}
