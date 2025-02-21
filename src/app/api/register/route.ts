// src/app/api/register/route.ts
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import getDb from '@/lib/db'; // Import the getDb function

/**
 * Handles POST requests to create a new user.
 */
export async function POST(req: NextRequest) {
    try {
        const db = await getDb(); // Use getDb() to get the database connection
        const users = db.collection('users');

        const { name, email, password, termsAccepted, newsletterSubscription, phoneNumber } = await req.json();

        if (!name || !email || !password || !termsAccepted) {
            return NextResponse.json({ message: 'Missing required fields, or terms not accepted' }, { status: 400 });
        }

        const existingUser = await users.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: 'User with this email already exists' }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = {
            _id: new ObjectId(),
            name,
            email,
            password: hashedPassword,
            phoneNumber, // Store phone number (can be null)
            role: 'user',
            termsAccepted,
            newsletterSubscription,
            emailVerified: null,
            image: null,
        };

        const result = await users.insertOne(newUser);

        return NextResponse.json({
            message: 'User created successfully', user: {
                id: result.insertedId.toString(),
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        }, { status: 201 });
    } catch (error: any) {
        console.error('Error registering user:', error);
        if (error.code === 11000) {
            return NextResponse.json({ message: 'A user with that email already exists.' }, { status: 409 });
        }
        return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
    }
}