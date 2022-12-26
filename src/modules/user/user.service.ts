import prisma from '@/utils/prisma';
import { CreateUserInput, UpdateUserInput } from './user.schema';
import { hashPassword } from '@/utils/hash';

export async function createUser(input: CreateUserInput) {
  const { password, ...rest } = input;

  const hashedPassword = await hashPassword(password);
  
  const user = await prisma.users.create({
    data: { ...rest, password: hashedPassword },
  });

  return user;
}


export async function findUserByEmail(email: string) {
  return prisma.users.findUnique({
    where: {
      email
    }
  });
}

export async function getUsers() {
  return prisma.users.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      created: true,
    }
  });
}

export async function getUser(id: number) {
  return prisma.users.findUnique({
    where: {
      id
    }
  });
}

export async function updateUser(id: number, input: UpdateUserInput) {
  await prisma.users.update({
    where: {
      id
    },
    data: input
  });
  return await getUser(id);
}

export async function getUserLevel(id: number) {
  return prisma.users.findUnique({
    select: {
      level: true,
    },
    where: {
      id
    }
  });
}