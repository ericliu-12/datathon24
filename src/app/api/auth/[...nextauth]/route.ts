import CreateUser from "@/actions/create_user";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_ID_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user }: any) {

      try {
        await CreateUser({ email: user.email });
      } catch (error) {
        console.error("Error creating user:", error);
        return false;
      }

      return true;
    },
  }
};

export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
