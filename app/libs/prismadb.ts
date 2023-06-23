import { PrismaClient } from "@prisma/client";
declare global {
	var prisma: PrismaClient | undefined;
}

const client = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalThis.prisma = client;
export default client;

// Primary  Goal: globalThis run only once in entire application, which is an best practice in nextjs because in dev environment that we have hot reload