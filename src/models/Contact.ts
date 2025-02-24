// src/models/Contact.ts
import mongoose, { Schema, model, models } from 'mongoose';
import { Contact } from '@/types';

const contactSchema = new Schema<Contact>({
    _id: { type: Schema.Types.ObjectId, required: true, auto: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true }, // Enforce unique emails
    phone: { type: String, required: false },
    company: { type: String, required: false },
    jobTitle: { type: String, required: false },
    status: { type: String, enum: ['lead', 'prospect', 'customer', 'other'], default: 'lead' },
    notes: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const ContactModel = models.Contact as mongoose.Model<Contact> || model<Contact>('Contact', contactSchema);
export default ContactModel;