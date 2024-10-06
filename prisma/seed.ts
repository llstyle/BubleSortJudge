import { PrismaClient, Role } from '@prisma/client';
import * as dotenv from 'dotenv';
import * as argon from 'argon2';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const password = await argon.hash(process.env.ADMIN_PASSWORD);
  await prisma.user.create({
    data: {
      role: Role.ADMIN,
      username: process.env.ADMIN_USERNAME,
      password,
    },
  });
}
main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
