/**
  * File: src/app/api/auth/[...nextauth]/route.ts
  * Purpose: Handles NextAuth.js API requests.
  * File Structure:
  *  - Imports
  *  - Route Handlers (GET, POST)
  */
import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };