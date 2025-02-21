/**
  * File: src/lib/auth.ts
  * Purpose: Configures NextAuth.js for authentication with Credentials, Google, Facebook, Twitter and Apple providers.
  */

import NextAuth, { NextAuthOptions, DefaultUser } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import TwitterProvider from 'next-auth/providers/twitter';
import AppleProvider from 'next-auth/providers/apple';
import CredentialsProvider from 'next-auth/providers/credentials';
//import { MongoDBAdapter } from "@next-auth/mongodb-adapter" // REMOVED
import getDb from './db'; // Import getDb FUNCTION
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import type { Account, Profile } from 'next-auth'; // Import Account and Profile

// --- Module Augmentation ---
declare module "next-auth" {
    interface User extends DefaultUser {
        role?: string;
    }
    interface Session {
        user: User;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        role?: string
    }
}

/**
 * Configuration options for NextAuth.js.
 */
export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID!,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
        }),
        TwitterProvider({ //Note X is now know as Twitter for next-auth
            clientId: process.env.TWITTER_CLIENT_ID!,
            clientSecret: process.env.TWITTER_CLIENT_SECRET!,
            version: "2.0", //necessary for X
        }),
        AppleProvider({
            clientId: process.env.APPLE_CLIENT_ID!,
            clientSecret: process.env.APPLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: 'Email and Password',
            credentials: {
                email: { label: 'Email', type: 'email', placeholder: 'your@email.com' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const db = await getDb(); // Use getDb()
                const users = db.collection('users');

                const user = await users.findOne({ email: credentials.email });

                if (!user) {
                    return null;
                }

                const passwordMatch = await bcrypt.compare(credentials.password, user.password);

                if (!passwordMatch) {
                    return null;
                }

                return {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    role: user.role,
                } as any;
            },
        }),
    ],
    callbacks: {
        // --- signIn Callback (NOW BEFORE adapter) ---
        async signIn({ user, account, profile }: { user: any, account: Account | null, profile?: Profile | undefined }) {  // Corrected type
            if (account?.provider !== 'credentials' && user?.email) {
                const db = await getDb();  // Use getDb() to get database
                const users = db.collection('users');
                const accounts = db.collection('accounts');

                const existingUser = await users.findOne({ email: user.email });
                console.log("Existing user found:", existingUser); // LOGGING

                if (existingUser) {
                    // Check if account is ALREADY linked
                    const existingAccount = await accounts.findOne({
                        userId: existingUser._id,
                        provider: account.provider,
                        providerAccountId: account.providerAccountId,
                    });
                    console.log("Existing account found:", existingAccount); // LOGGING


                    if (!existingAccount) {
                        // Link the accounts
                        console.log("Linking accounts..."); // LOGGING
                        try {
                            await accounts.insertOne({
                                userId: existingUser._id,  // Use existingUser._id
                                type: account.type,
                                provider: account.provider,
                                providerAccountId: account.providerAccountId,
                                refresh_token: account.refresh_token,
                                access_token: account.access_token,
                                expires_at: account.expires_at,
                                token_type: account.token_type,
                                scope: account.scope,
                                id_token: account.id_token,
                                session_state: account.session_state,
                            });
                            console.log("Accounts linked successfully."); // LOGGING
                        } catch (error) {
                            console.error("Error linking accounts:", error); // LOGGING
                            return false; // Prevent sign-in on error
                        }
                    } else {
                        console.log("Accounts already linked."); // LOGGING
                    }
                } else {
                    console.log("No existing user with this email. NextAuth will create one."); // LOGGING
                }
            } else if (account?.provider === 'credentials') {
                console.log('Credentials sign in attempt.');
            } else if (!user?.email) {
                console.log('No email found in user object');
            }
            return true; // Always allow sign-in
        },

        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
                token.sub = user.id;   // Use 'id' (from CredentialsProvider) as 'sub'
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                // @ts-ignore
                session.user.role = token.role;
                // @ts-ignore
                session.user.id = token.sub;     // Set the 'id' on the session.user
            }
            return session;
        },
    },
    //adapter: MongoDBAdapter(clientPromise), // Remove the adapter
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const auth = NextAuth(authOptions);

export default auth;