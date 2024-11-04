// lib/db.js
import { PrismaClient } from '@prisma/client';

let prisma;

// Check if there is already a Prisma Client instance
if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient();
} else {
    // Create a new Prisma Client instance for development
    if (!global.prisma) {
        global.prisma = new PrismaClient();
    }
    prisma = global.prisma;
}

export default prisma;
