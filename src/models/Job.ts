// src/models/Job.ts
import mongoose, { Schema, model, models } from 'mongoose';
import { Job } from '@/types';

const jobSchema = new Schema<Job>({
    _id: { type: Schema.Types.ObjectId, required: true, auto: true },
    title: { type: String, required: true },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true }, // Reference to Company
    description: { type: String, required: true },
    location: { type: String, required: true },
    salaryRange: { type: String, required: false },
    type: { type: String, enum: ['full-time', 'part-time', 'contract', 'internship'], required: true },
    postedDate: { type: Date, default: Date.now },
    closingDate: { type: Date },
    isActive: { type: Boolean, default: false },
    requirements: { type: [String], default: [] }, // Array of strings
});

const JobModel = models.Job as mongoose.Model<Job> || model<Job>('Job', jobSchema);
export default JobModel;