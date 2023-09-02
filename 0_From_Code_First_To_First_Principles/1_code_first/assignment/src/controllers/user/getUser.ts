// import { PrismaClient } from "@prisma/client";
import prisma from "../../prisma/prisma";
import { Request, Response } from "express";

interface QueryParams {
  email: string;
}

export async function getUser(
  req: Request<{}, {}, {}, QueryParams>,
  res: Response
) {
  const { email } = req.query;

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res
        .status(404)
        .json({ error: "UserNotFound", data: undefined, success: false });
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
    console.error("Error querying the database:", error);
    res
      .status(500)
      .json({ error: "ValidationError", data: undefined, success: false });
  }
}
