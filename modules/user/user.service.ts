import prisma from '@/utils/prisma';
import { PostUserBody, PutUserBody } from './user.schema';
import { hashPassword, generateToken } from '@/utils/hash';

export async function createUser(input: PostUserBody) {
  const { password, ...rest } = input;

  const hashedPassword = await hashPassword(password);

  return await prisma.users.create({
    data: { ...rest, password: hashedPassword, token: await generateToken(32) },
  });
}

export async function createTokenPwd(id: number) {
  return prisma.users.update({
    where: {
      id,
    },
    data: {
      tokenpwd: await generateToken(32),
    },
  });
}

export async function sResetPasswordBody(token: string, password: string) {
  const hashedPassword = await hashPassword(password);
  await prisma.users.updateMany({
    where: {
      tokenpwd: token,
    },
    data: {
      password: hashedPassword,
    },
  });
  return (
    await prisma.users.findMany({
      where: {
        tokenpwd: token,
      },
    })
  )[0];
}

export async function getUserByToken(token: string) {
  return prisma.users.findMany({
    where: {
      token,
    },
  });
}
export async function sActivateUserBody(id: number) {
  return prisma.users.update({
    where: {
      id,
    },
    data: {
      verified: 1,
    },
  });
}

export async function findUserByEmail(email: string) {
  return prisma.users.findUnique({
    where: {
      email,
    },
  });
}

export async function getUsers() {
  return prisma.users.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      created: true,
    },
  });
}

export async function getUser(id: number) {
  return prisma.users.findUnique({
    where: {
      id,
    },
  });
}

export async function updateUser(id: number, input: PutUserBody) {
  await prisma.users.update({
    where: {
      id,
    },
    data: input,
  });
  return await getUser(id);
}

export async function getUserLevel(id: number) {
  return prisma.users.findUnique({
    select: {
      level: true,
    },
    where: {
      id,
    },
  });
}

export async function isAdmin(id: number) {
  const { level } = (await getUserLevel(id)) || { level: 0 };
  return level && level >= 2;
}

export async function isSuperAdmin(id: number) {
  const { level } = (await getUserLevel(id)) || { level: 0 };
  return level && level >= 4;
}
