// src/lib/db.ts
import { MongoClient, Db } from 'mongodb';
import { getServerSession } from 'next-auth/next'; // Correct import
import { authOptions } from '@/lib/auth';

if (!process.env.MONGODB_URI) {
    throw new Error('Please add your Mongo URI to .env.local');
}

const uri = process.env.MONGODB_URI;
const adminDbName = process.env.MONGODB_ADMIN_DB_NAME; // The name of your admin database
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).

    const globalWithMongo = global as typeof globalThis & {
        _mongoClientPromise?: Promise<MongoClient>
    }

    if (!globalWithMongo._mongoClientPromise) {
        client = new MongoClient(uri, options);
        globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
} else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
}

/**
 * Get the MongoDB client promise, dynamically selecting the database.
 */
async function getDb(): Promise<Db> {
    const client = await clientPromise;

    // Get the session *server-side*.  This is crucial.
    const session = await getServerSession(authOptions);

    // Default to the admin database if no user is logged in.
    let dbName = adminDbName;

    if (session && session.user && session.user.id) {
        // 1. Connect to the admin database.
        const adminDb = client.db(adminDbName);

        // 2. Retrieve the user's instance database name from the 'instances' collection.
        const instances = adminDb.collection('instances'); // Or your collection name
        const instance = await instances.findOne({ userId: session.user.id });

        if (instance) {
            dbName = instance.dbName; // Use the user's database name.
            console.log("Using db:", dbName)
        } else {
            console.warn(`No instance found for user ID: ${session.user.id}. Using admin DB.`);
            // Handle the case where no instance is found (e.g., new user).
            // You might choose to create a default database here, or return an error.
        }
    }

    return client.db(dbName); // Return the correct Db object
}

export default getDb; // Export the function, NOT the promise directly