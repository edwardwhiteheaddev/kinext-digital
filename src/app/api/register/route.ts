// src/app/api/register/route.ts
import { MongoClient, ObjectId, Collection, Db } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getDb, UserModel } from '@/lib/db';
import fnv1a32 from '@sindresorhus/fnv1a';
import mongoose, { mongo } from 'mongoose';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

const DB_PREFIX = process.env.MONGO_INSTANCE_DB_PREFIX;
const ADMIN_DB_NAME = process.env.MONGODB_ADMIN_DB_NAME;

/**
 * Creates a new instance (database) for a user, and adds a mapping to the admin DB.
 * @param adminDb The admin Db object.
 * @param userId The ID of the user.
 * @param dbName The name of the new database.
 */
async function createInstance(adminDb: Db, userId: string, dbName: string) {
    console.log("AdminDB: ", adminDb);
    console.log("UserId: ", userId);
    console.log("DBName: ", dbName);

    const instances: Collection = adminDb.collection('instances');
    await instances.insertOne({ userId, dbName });
    console.log(`Created instance for user ${userId} with database name ${dbName}.`);
}

/**
 * Handles POST requests to create a new user.
 */
export async function POST(req: NextRequest) {
    let client: Db | undefined; // Declare client outside try block

    try {
        const adminDb = await getDb(); // Connect to the *admin* database initially
        client = adminDb.db;

        const { name, email, password, termsAccepted, newsletterSubscription, phoneNumber } = await req.json();

        if (!name || !email || !password || !termsAccepted) {
            return NextResponse.json({ message: 'Missing required fields, or terms not accepted' }, { status: 400 });
        }

        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: 'User with this email already exists' }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new UserModel({
            _id: new ObjectId(),
            name,
            email,
            password: hashedPassword,
            phoneNumber, // Store phone number (can be null)
            role: 'user',
            termsAccepted,
            newsletterSubscription,
            image: null
        }).toObject();
        newUser._id = new ObjectId(); // Ensure _id is of type ObjectId

        // --- Create User in Admin DB ---
        const adminUsers = adminDb.collection('users');
        const adminResult = await adminUsers.insertOne({
            ...newUser,
            _id: new ObjectId(newUser._id)
        });
        const userId = adminResult.insertedId.toString();

        // --- 2. Generate Database Name (Shorter + Hashed) ---
        const dbName = `${DB_PREFIX}${fnv1a32(userId).toString(16)}`;
        const db = mongoose.connection.db;
        console.log("DB: ", db);

        if (!db) {
            throw new Error('Failed to get the database instance');
        }

        // --- 3. Create instance mapping in admin DB ---
        await createInstance(db, userId, dbName);

        // Connect to the *new user's* database.
        const userDb = client;
        console.log("UserDB: ", userDb);

        const listOfDbs = await adminDb.listDatabases();
        const session = await getServerSession(authOptions);
        const userDbFound = listOfDbs.databases.find((db) => db.name === `${process.env.DB_PREFIX}${fnv1a32(session.user.id).toString(16)}`)

        // --- 4. Create the user's database ---
        await userDb?.createCollection('users');

        // Now, insert the user into the *user's* database, using the SAME _id
        await db.collection('users').insertOne({
            ...newUser,
            _id: new ObjectId(userId), // Use the same ObjectId
        });

        return NextResponse.json({
            message: 'User created successfully', user: {
                id: userId, // Use the consistent ID
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
