// src/types/index.ts

import { ObjectId } from 'mongodb';

// --- CMS ---
export interface Page {
    _id: ObjectId; // Use ObjectId for the _id
    title: string;
    slug: string; // Unique, URL-friendly identifier
    content: string; // Could be HTML, Markdown, or a custom format
    createdAt: Date;
    updatedAt: Date;
    published: boolean;
}

export interface ContentBlock {
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

export interface Interaction {
    _id: ObjectId;
    contactId: ObjectId; // Link to Contact
    type: 'call' | 'email' | 'meeting' | 'note';
    date: Date;
    notes?: string;
}

// --- Career Portal ---
export interface Job {
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

export interface Company {
    _id: ObjectId;
    name: string;
    description?: string;
    industry?: string;
    website?: string;
    logoUrl?: string;
}

export interface Application {
    _id: ObjectId;
    jobId: ObjectId;
    contactId: ObjectId; // Link to Contact (applicant)
    submittedDate: Date;
    coverLetter?: string;
    resumeUrl: string; // URL to the resume (e.g., stored in Firebase Storage)
    status: 'applied' | 'reviewed' | 'interviewing' | 'rejected' | 'hired';
}

export interface User { // Should align with NextAuth user
    _id: ObjectId | string; // Allow string for Credentials provider
    name: string;
    email: string | null;
    password: string; // Only for credential provider
    image?: string | null;
    role: string;
    phoneNumber?: string | null; // For phone auth
    termsAccepted: boolean;    // For registration
    newsletterSubscription?: boolean;
}