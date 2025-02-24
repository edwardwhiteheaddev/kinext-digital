// src/models/Application.ts
import mongoose, { Schema, model, models } from 'mongoose';
import { Application } from '@/types';

const applicationSchema = new Schema<Application>({
    _id: { type: Schema.Types.ObjectId, required: true, auto: true },
    jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },   // Reference to Job
    contactId: { type: Schema.Types.ObjectId, ref: 'Contact', required: true }, // Reference to Contact
    submittedDate: { type: Date, default: Date.now },
    coverLetter: { type: String, required: false },
    resumeUrl: { type: String, required: true },
    status: { type: String, enum: ['applied', 'reviewed', 'interviewing', 'rejected', 'hired'], default: 'applied' },
});

const ApplicationModel = models.Application as mongoose.Model<Application> || model<Application>('Application', applicationSchema);
export default ApplicationModel;