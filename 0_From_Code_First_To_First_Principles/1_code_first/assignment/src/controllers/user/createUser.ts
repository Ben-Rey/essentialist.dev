import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const userClient = new PrismaClient().user;

function generateRandomPassword(): string {
  return Math.random().toString(36).slice(-8);
}

export async function createUser(req: Request, res: Response) {
  const { username, email, firstName, lastName } = req.body;

  if (!username || !email || !firstName || !lastName) {
    return res
      .status(400)
      .json({ error: "Please provide all required fields" });
  }

  try {
    const user = await userClient.findMany({
      where: {
        OR: [{ email: email }, { username: username }],
      },
    });

    if (user.length > 0) {
      let errorReason;

      if (user[0].email === email) {
        errorReason = "EmailAlreadyInUse";
      }

      if (user[0].username === username) {
        errorReason = "UsernameAlreadyTaken";
      }

      return res.status(400).json({
        error: errorReason,
        data: undefined,
        success: false,
      });
    }

    const createdUser = await userClient.create({
      data: {
        username,
        email,
        firstName,
        lastName,
        password: generateRandomPassword(),
      },
    });

    return res.json({
      error: undefined,
      data: { id: createdUser.id, email, username, firstName, lastName },
      success: true,
    });
  } catch (error) {
    console.error("Error querying the database:", error);
    return res
      .status(500)
      .json({ error: "ValidationError", data: undefined, success: false });
  }
}
