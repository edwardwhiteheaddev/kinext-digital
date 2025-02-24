// src/lib/db.ts
import mongoose, { Model, Schema } from 'mongoose';
import { getServerSession } from 'next-auth/next'; // Correct import
import { authOptions } from '@/lib/auth';
import fnv1a32 from '@sindresorhus/fnv1a';
import { Page, ContentBlock, Contact, Interaction, Job, Company, Application, User } from '@/types'; // Import ALL interfaces
import * as dotenv from 'dotenv';
import * as path from 'path';

// --- Load Environment Variables ---
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

if (!process.env.MONGODB_URI) {
    throw new Error('Please add your Mongo URI to .env.local');
}

const uri = process.env.MONGODB_URI;
const adminDbName = process.env.MONGODB_ADMIN_DB_NAME; // The name of your admin database

// --- Page Schema ---
const pageSchema = new mongoose.Schema<Page>({
    _id: { type: Schema.Types.ObjectId, required: true, auto: true },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true }, // Ensure slugs are unique
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    published: { type: Boolean, default: false },
});

// --- ContentBlock Schema ---
const contentBlockSchema = new mongoose.Schema<ContentBlock>({
    _id: { type: Schema.Types.ObjectId, required: true, auto: true },
    pageId: { type: Schema.Types.ObjectId, ref: 'Page', required: true }, // Reference to Page
    type: { type: String, required: true },
    data: { type: Schema.Types.Mixed, required: true }, // Can be any type
    order: { type: Number, required: true },
});

// --- Contact Schema ---
const contactSchema = new mongoose.Schema<Contact>({
    _id: { type: Schema.Types.ObjectId, required: true, auto: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true }, // Enforce unique emails
    company: { type: String },
    status: { type: String, enum: ['lead', 'prospect', 'customer', 'other'], default: 'lead' },
    notes: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

// --- Interaction Schema ---
const interactionSchema = new mongoose.Schema<Interaction>({
    _id: { type: Schema.Types.ObjectId, required: true, auto: true },
    contactId: { type: Schema.Types.ObjectId, ref: 'Contact', required: true }, // Reference to Contact
    type: { type: String, required: true },
    notes: { type: String },
    date: { type: Date, default: Date.now },
});

// --- Job Schema ---
const jobSchema = new mongoose.Schema<Job>({
    _id: { type: Schema.Types.ObjectId, required: true, auto: true },
    title: { type: String, required: true },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true }, // Reference to Company
    description: { type: String, required: true },
    location: { type: String, required: true },
    salaryRange: { type: String },
    type: { type: String, enum: ['full-time', 'part-time', 'contract', 'internship'], required: true },
    postedDate: { type: Date, default: Date.now },
    closingDate: { type: Date },
    isActive: { type: Boolean, default: true },
    requirements: { type: [String], default: [] }, // Array of strings
});

// --- Company Schema ---
const companySchema = new mongoose.Schema<Company>({
    _id: { type: Schema.Types.ObjectId, required: true, auto: true },
    name: { type: String, required: true },
    description: { type: String },
    industry: { type: String },
    website: { type: String },
    logoUrl: { type: String },
});

// --- Application Schema ---
const applicationSchema = new mongoose.Schema<Application>({
    _id: { type: Schema.Types.ObjectId, required: true, auto: true },
    jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },   // Reference to Job
    contactId: { type: Schema.Types.ObjectId, ref: 'Contact', required: true }, // Reference to Contact
    submittedDate: { type: Date, default: Date.now },
    coverLetter: { type: String },
    resumeUrl: { type: String, required: true },
    status: { type: String, enum: ['applied', 'reviewed', 'interviewing', 'rejected', 'hired'], default: 'applied' },
});

// --- User Schema ---
const userSchema = new Schema<User>({
    _id: { type: Schema.Types.Mixed, required: true }, // Can be ObjectId or string
    name: { type: String },
    email: { type: String, unique: true, sparse: true }, // Unique, but allow null
    password: { type: String }, // Hashed password
    image: { type: String },
    role: { type: String, default: 'user' },
    phoneNumber: { type: String, unique: true, sparse: true }, // Unique, but allow null
    termsAccepted: { type: Boolean },
    newsletterSubscription: { type: Boolean }
});

// --- IMPORTANT: Prevent model redefinition ---
const PageModel: Model<Page> = (mongoose.models.Page as Model<Page>) || mongoose.model<Page>('Page', pageSchema);
const ContentBlockModel: Model<ContentBlock> = (mongoose.models.ContentBlock as Model<ContentBlock>) || mongoose.model<ContentBlock>('ContentBlock', contentBlockSchema);
const ContactModel: Model<Contact> = (mongoose.models.Contact as Model<Contact>) || mongoose.model<Contact>('Contact', contactSchema);
const InteractionModel: Model<Interaction> = (mongoose.models.Interaction as Model<Interaction>) || mongoose.model<Interaction>('Interaction', interactionSchema);
const JobModel: Model<Job> = (mongoose.models.Job as Model<Job>) || mongoose.model<Job>('Job', jobSchema);
const CompanyModel: Model<Company> = (mongoose.models.Company as Model<Company>) || mongoose.model<Company>('Company', companySchema);
const ApplicationModel: Model<Application> = (mongoose.models.Application as Model<Application>) || mongoose.model<Application>('Application', applicationSchema);
const UserModel: Model<User> = (mongoose.models.User as Model<User>) || mongoose.model<User>('User', userSchema);
/**
 * Get the MongoDB client promise, dynamically selecting the database.
 */
async function getDb(): Promise<mongoose.Connection> {
    // Ensure Mongoose is connected
    if (mongoose.connection.readyState === 0) { // 0 = disconnected
        await new Promise((resolve) => {
            mongoose.connection.on('connected', resolve);
            mongoose.connect(uri); // Connect using mongoose.connect
        });
        console.log('Connected to MongoDB (Mongoose)');
    }

    const session = await getServerSession(authOptions);
    // Default to the admin database if no user is logged in.
    let dbName = adminDbName;

    if (session && session.user && session.user.id) {
        if (mongoose.connection.db) {
            const adminDb = mongoose.connection.db.admin(); // Get admin interface. No await needed.
            const list = await adminDb.listDatabases()
            const dbFound = list.databases.find((db) => db.name === `${process.env.DB_PREFIX}${fnv1a32(session.user.id).toString(16)}`);

            if (dbFound) {
                dbName = dbFound.name;
            } else {
                console.warn(`No instance found for user ID: ${session.user.id}. Using admin DB.`);
                // Handle the case where no instance is found (e.g., new user).
                // You might choose to create a default database here, or return an error.
            }
        } else {
            console.error('Mongoose connection database is not available');
            // Handle the error or throw an exception
        }
    }

    // Return the *Mongoose connection*, and let Mongoose handle the database selection.
    if (dbName) {
        return mongoose.connection.useDb(dbName, { useCache: true });
    } else {
        throw new Error('dbName is undefined');
    }
}

// Export the getDb function and the models
export { getDb, PageModel, ContentBlockModel, ContactModel, InteractionModel, JobModel, CompanyModel, ApplicationModel, UserModel };