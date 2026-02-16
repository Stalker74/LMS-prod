import NextAuth from "next-auth";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";

export const {signIn, signOut,auth, handlers} = NextAuth({
  providers: [Google, Github],
})
