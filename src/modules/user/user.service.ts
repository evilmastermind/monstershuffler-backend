import prisma from '@/utils/prisma';
import { CreateUserInput } from './user.schema';
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