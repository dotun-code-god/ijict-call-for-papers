import { PrismaClient } from "@prisma/client";
import { withAccelerate } from '@prisma/extension-accelerate';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const basePrisma = new PrismaClient();
export const database =
  globalForPrisma.prisma || basePrisma.$extends(withAccelerate());

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = database;