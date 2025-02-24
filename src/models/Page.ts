// src/models/Page.ts
import mongoose, { Schema, model, models } from 'mongoose';
import { Page } from '@/types';

// --- Page Schema ---
const pageSchema = new Schema<Page>({
    _id: { type: Schema.Types.ObjectId, required: true, auto: true },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true }, // Ensure slugs are unique
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    published: { type: Boolean, default: false },
});

// --- IMPORTANT: Prevent model redefinition ---
// This is crucial when using Next.js with hot reloading,
// as the code might be re-executed multiple times, leading to errors.
const PageModel = models.Page as mongoose.Model<Page> || model<Page>('Page', pageSchema);
export default PageModel;