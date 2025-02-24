/**
  * File: mongodb-setup.ts
  * Purpose: Sets up the MongoDB databases (admin and initial user),
  *          defines schemas, and inserts sample data.  Also creates a
  *          user in BOTH the admin DB and the per-user DB.
  */

import { MongoClient, Db, Collection, ObjectId } from 'mongodb';
import * as dotenv from 'dotenv';
import * as path from 'path';
import bcrypt from 'bcryptjs';
import fnv1a32 from '@sindresorhus/fnv1a';

// --- Load Environment Variables ---
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// --- Constants ---
const SAMPLE_DATA_COUNT = 5;
const ADMIN_DB_NAME = process.env.MONGODB_ADMIN_DB_NAME; // Consistent admin DB name
const DB_PREFIX = process.env.MONGO_INSTANCE_DB_PREFIX; // Shorter prefix

// --- Interface Definitions (Schemas) --- Keep as before

interface Page {
  _id: ObjectId; // Use ObjectId for the _id
  title: string;
  slug: string; // Unique, URL-friendly identifier
  content: string; // Could be HTML, Markdown, or a custom format
  createdAt: Date;
  updatedAt: Date;
  published: boolean;
}

interface ContentBlock {
  _id: ObjectId;
  pageId: ObjectId; // Link to the Page it belongs to
  type: string; // e.g., 'text', 'image', 'video', 'hero', 'callout', etc.
  data: any; //  Content-specific data.  Use more specific types later.
  order: number; //  For ordering blocks within a page
}

// --- CRM ---
export interface Contact {
  _id: ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;  // Optional phone
  company?: string;
  jobTitle?: string;
  status: 'lead' | 'prospect' | 'customer' | 'other'; // Example statuses
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Interaction {
  _id: ObjectId;
  contactId: ObjectId; // Link to Contact
  type: 'call' | 'email' | 'meeting' | 'note';
  date: Date;
  notes?: string;
}

// --- Career Portal Schemas ---
interface Job {
  _id: ObjectId;
  title: string;
  companyId: ObjectId; // Link to Company
  description: string; //  Could be HTML/Markdown
  location: string;
  salaryRange?: string; //  Optional salary range
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  postedDate: Date;
  closingDate?: Date; //  Optional closing date
  isActive: boolean;
  requirements: string[]; // e.g., skills, experience
}

interface Company {
  _id: ObjectId;
  name: string;
  description?: string;
  industry?: string;
  website?: string;
  logoUrl?: string;
}

interface Application {
  _id: ObjectId;
  jobId: ObjectId;
  contactId: ObjectId; // Link to Contact (applicant)
  submittedDate: Date;
  coverLetter?: string;
  resumeUrl: string; // URL to the resume (e.g., stored in Firebase Storage)
  status: 'applied' | 'reviewed' | 'interviewing' | 'rejected' | 'hired';
}

interface User { // Should align with NextAuth user
  _id: ObjectId | string; // Allow string for Credentials provider
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  password: string; // Only for credential provider
  image?: string | null;
  role: string;
  phoneNumber?: string | null; // For phone auth
  termsAccepted: boolean;    // For registration
  newsletterSubscription?: boolean;
}

// --- Database Connection Function ---

/**
 * Connects to the MongoDB database.  Handles both the admin DB and user DBs.
 * @param dbName Optional. The name of the database to connect to. Defaults to admin DB.
 * @returns A Promise that resolves to the Db object.
 * @throws Error if the connection fails.
 */
async function connectToDatabase(dbName?: string): Promise<Db> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI environment variable is not set.');
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');
    return client.db(dbName ?? ADMIN_DB_NAME); // Connect to specified DB, or admin DB by default
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}


// --- Sample Data Functions (Keep these as they are) ---

async function insertSamplePages(db: Db) {
  const pages: Collection<Page> = db.collection('pages');
  const samplePages: Omit<Page, '_id'>[] = [];
  for (let i = 0; i < SAMPLE_DATA_COUNT; i++) {
    samplePages.push({
      title: `Sample Page ${i + 1}`,
      slug: `sample-page-${i + 1}`,
      content: `<p>This is the content of sample page ${i + 1}.</p>`,
    });
  }

  await pages.insertMany(samplePages);
  console.log(`Inserted ${SAMPLE_DATA_COUNT} sample pages.`);
}

async function insertSampleContentBlocks(db: Db) {
  const contentBlocks: Collection<ContentBlock> = db.collection('contentBlocks');
  const sampleBlocks: Omit<ContentBlock, '_id'>[] = [];
  for (let i = 0; i < SAMPLE_DATA_COUNT; i++) {
    sampleBlocks.push({
      type: 'text',
      data: `This is sample text block ${i + 1}.`,
    });
  }
  await contentBlocks.insertMany(sampleBlocks);
  console.log(`Inserted ${SAMPLE_DATA_COUNT} sample content blocks.`);
}

async function insertSampleContacts(db: Db) {
  const contacts: Collection<Contact> = db.collection('contacts');
  const sampleContacts: Omit<Contact, '_id'>[] = [];
  for (let i = 0; i < SAMPLE_DATA_COUNT; i++) {
    sampleContacts.push({
      name: `Contact ${i + 1}`,
      email: `contact${i + 1}@example.com`,
      company: `Company ${i + 1}`,
      status: 'lead',
    });
  }
  await contacts.insertMany(sampleContacts);
  console.log(`Inserted ${SAMPLE_DATA_COUNT} sample contacts.`);
}

async function insertSampleInteractions(db: Db) {
  const interactions: Collection<Interaction> = db.collection('interactions');
  const contacts: Collection<Contact> = db.collection('contacts');
  const allContacts = await contacts.find().toArray();
  const sampleInteractions: Omit<Interaction, '_id'>[] = [];

  for (const contact of allContacts) {
    sampleInteractions.push({
      contactId: contact._id!, // Use the _id of existing contacts
      type: 'email',
      notes: `Initial contact email for ${contact.name}`,
      date: new Date(),
    });
  }
  await interactions.insertMany(sampleInteractions);
  console.log(`Inserted sample interactions.`);
}

async function insertSampleJobs(db: Db) {
  const jobs: Collection<Job> = db.collection('jobs');
  const companies: Collection<Company> = db.collection('companies');
  const allCompanies = await companies.find().toArray();
  const sampleJobs: Omit<Job, '_id'>[] = [];

  for (const company of allCompanies) {
    sampleJobs.push({
      title: `Software Engineer at ${company.name}`,
      description: `We are looking for a talented software engineer to join our team at ${company.name}.`,
      location: 'Remote',
      salary: 'Competitive',
      companyId: company._id!,
      isActive: true,
    });
  }
  await jobs.insertMany(sampleJobs);
  console.log(`Inserted ${SAMPLE_DATA_COUNT} sample jobs.`);
}

async function insertSampleCompanies(db: Db) {
  const companies: Collection<Company> = db.collection('companies');
  const sampleCompanies: Omit<Company, '_id'>[] = [];
  for (let i = 0; i < SAMPLE_DATA_COUNT; i++) {
    sampleCompanies.push({
      name: `Company ${i + 1}`,
      description: `This is a description for Company ${i + 1}.`,
      industry: 'Technology',
    });
  }
  await companies.insertMany(sampleCompanies);
  console.log(`Inserted ${SAMPLE_DATA_COUNT} sample companies.`);
}

async function insertSampleApplications(db: Db) {
  const applications: Collection<Application> = db.collection('applications');
  const jobs: Collection<Job> = db.collection('jobs');
  const contacts: Collection<Contact> = db.collection('contacts');

  const allJobs = await jobs.find().toArray();
  const allContacts = await contacts.find().toArray();
  const sampleApplications: Omit<Application, '_id'>[] = [];

  // Create a few applications, linking existing jobs and contacts.
  for (let i = 0; i < SAMPLE_DATA_COUNT; i++) {
    if (allJobs.length > 0 && allContacts.length > 0) {
      sampleApplications.push({
        jobId: allJobs[i % allJobs.length]._id!, // Use modulo to cycle through jobs
        contactId: allContacts[i % allContacts.length]._id!, // and contacts
        resumeUrl: `resume${i + 1}.pdf`,
        coverLetter: `Cover letter for application ${i + 1}`,
        status: 'applied',
      });
    }
  }
  await applications.insertMany(sampleApplications);
  console.log(`Inserted sample applications.`);
}

// --- Instance Creation Function ---

/**
 * Creates a new instance (database) for a user, and adds a mapping to the admin DB.
 * @param adminDb The admin Db object.
 * @param userId The ID of the user.
 * @param dbName The name of the new database.
 */
async function createInstance(adminDb: Db, userId: string, dbName: string) {
  const instances: Collection = adminDb.collection('instances');
  await instances.insertOne({ userId, dbName });
  console.log(`Created instance for user ${userId} with database name ${dbName}.`);
}

// --- Main Migration Function ---

/**
 * Runs the database setup and migration.
 */
async function runMigration() {
  let client: MongoClient | null = null;
  try {
    // Connect to the admin database FIRST
    const adminDb = await connectToDatabase(ADMIN_DB_NAME);
    client = adminDb.client; // Keep track of the MongoClient

    // Create a new user (replace with actual registration data)
    const hashedPassword = await bcrypt.hash('password', 12);
    const newUser = {
      _id: new ObjectId(),
      name: "Test User",
      email: 'test@example.com',
      password: hashedPassword,
      role: 'user',
      termsAccepted: true,
      newsletterSubscription: false,
      emailVerified: null,
      image: null,
    };

    // --- 1. Insert user into 'users' collection in ADMIN DB ---
    const adminUsers: Collection = adminDb.collection('users');
    const adminUserResult = await adminUsers.insertOne(newUser);
    const userId = adminUserResult.insertedId.toString();
    console.log(`Inserted user into admin DB with ID: ${userId}`);

    // --- 2. Generate Database Name (Shorter + Hashed) ---
    const dbName = `${DB_PREFIX}${fnv1a32(userId).toString(16)}`;
    console.log(`Generated database name: ${dbName}`);

    // --- 3. Create instance mapping in admin DB ---
    await createInstance(adminDb, userId, dbName);

    // --- 4. Connect to the *new user's* database ---
    const userDb = await connectToDatabase(dbName);

    // --- 5. Insert the SAME user into the 'users' collection in the USER'S DB ---
    //      Crucially, use the *same* ObjectId!
    const userResult = await userDb.collection('users').insertOne({
      ...newUser,  // Copy all user data
      _id: new ObjectId(userId), // Ensure _id is the same
    });
    console.log(`Inserted user into user DB with ID: ${userResult.insertedId}`);

    // --- 6. Insert sample data into the *user's* database ---
    await insertSamplePages(userDb);
    await insertSampleContentBlocks(userDb);
    await insertSampleCompanies(userDb);
    await insertSampleContacts(userDb);
    await insertSampleJobs(userDb);
    await insertSampleInteractions(userDb);
    await insertSampleApplications(userDb);


    console.log('Database setup and migration completed successfully.');

  } catch (error) {
    console.error('Database setup and migration failed:', error);
  } finally {
    if (client) {
      await client.close();
    }
    process.exit();
  }
}

// --- Script Execution ---

console.log('--- MongoDB Setup and Migration Script ---');
console.log('This script will connect to your MongoDB database, create collections, and insert sample data.');
console.log('Make sure you have set the MONGODB_URI environment variable in your .env.local file.');
console.log('Running the migration...');

runMigration();