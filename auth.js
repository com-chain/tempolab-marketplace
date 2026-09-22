import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";

class PendingApprovalError extends CredentialsSignin {
  code = "pending-approval";
}
class AccountRejectedError extends CredentialsSignin {
  code = "account-rejected";
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        identifier: {}, // nom d'utilisateur ou e-mail
        password: {},
      },
      async authorize(credentials) {
        const identifier = credentials?.identifier;
        const password = credentials?.password;
        if (!identifier || !password) return null;

        const member = await prisma.member.findFirst({
          where: {
            OR: [{ username: identifier }, { email: identifier }],
          },
        });
        if (!member) return null;

        const isValidPassword = await verifyPassword(
          password,
          member.passwordHash
        );
        if (!isValidPassword) return null;

        if (member.status !== "APPROVED") {
          // Le compte existe mais n'est pas encore validé par un administrateur.
          throw member.status === "PENDING"
            ? new PendingApprovalError()
            : new AccountRejectedError();
        }

        return {
          id: member.id,
          name: member.username,
          email: member.email,
          role: member.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
});
