import prisma from "../../prisma/prisma";

export const findUnique = async (
  field: "id" | "email" | "username",
  value: string | number
) => {
  return await prisma.user.findUnique({
    where: {
      [field]: value,
    } as any,
  });
};

export const findMany = async (fieldList: any[]) => {
  return await prisma.user.findMany({
    where: {
      OR: fieldList,
    },
  });
};

export const createNewUser = async (data: any) => {
  return await prisma.user.create({
    data,
  });
};

export const updateUserInfo = async (userId: string, data: any) => {
  return await prisma.user.update({
    where: {
      id: parseInt(userId),
    },
    data,
  });
};
