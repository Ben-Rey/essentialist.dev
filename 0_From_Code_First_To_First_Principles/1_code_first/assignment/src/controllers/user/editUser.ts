import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const userClient = new PrismaClient().user;

export async function editUser(req: Request, res: Response) {
  const { userId } = req.params;
  const { username, email, firstName, lastName } = req.body;

  if (username) {
    const user = await userClient.findFirst({
      where: {
        username: username,
      },
    });

    if (user) {
      return res.status(400).json({
        error: "UsernameAlreadyTaken",
        data: undefined,
        success: false,
      });
    }
  }

  if (email) {
    const user = await userClient.findFirst({
      where: {
        email: email,
      },
    });

    if (user) {
      return res.status(400).json({
        error: "EmailAlreadyInUse",
        data: undefined,
        success: false,
      });
    }
  }

  try {
    const user = await userClient.findUnique({
      where: {
        id: parseInt(userId),
      },
    });

    if (!user) {
      return res
        .status(400)
        .json({ error: "UserNotFound", data: undefined, success: false });
    }

    const updatedUser = await userClient.update({
      where: {
        id: parseInt(userId),
      },
      data: {
        username,
        email,
        firstName,
        lastName,
      },
    });

    res.json({
      error: undefined,
      data: updatedUser,
      success: true,
    });
  } catch (error) {
    console.error("Error querying the database:", error);
    res
      .status(500)
      .json({ error: "ValidationError", data: undefined, success: false });
  }
}
