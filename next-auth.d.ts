import "next-auth/jwt";
import { UserRole } from "@prisma/client";
// import NextAuth, { type DefaultSession } from "next-auth";


declare module "next-auth" {
    interface User {
        id: string,
        role: UserRole
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        role?: UserRole
    }
}


export type ExtendedUser = User & {
    role: UserRole;
    isTwoFactorEnabled: boolean;
    isOAuth: boolean;
};

declare module "next-auth" {
    interface Session {
        user: ExtendedUser;
    }
}