// src/models/Company.ts
import mongoose, { Schema, model, models } from 'mongoose';
import { Company } from '@/types';

const companySchema = new Schema<Company>({
    _id: { type: Schema.Types.ObjectId, required: true, auto: true },
    name: { type: String, required: true },
    description: { type: String, required: false },
    industry: { type: String, required: false },
    website: { type: String, required: false },
    logoUrl: { type: String, required: false },
});
const CompanyModel = models.Company as mongoose.Model<Company> || model<Company>('Company', companySchema);

export default CompanyModel;