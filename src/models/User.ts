// src/models/User.ts
import mongoose, { Schema, model, models } from 'mongoose';
import { User } from '@/types';

const userSchema = new Schema<User>({
    _id: { type: Schema.Types.Mixed, required: true }, // Can be ObjectId or string
    name: { type: String, required: true },
    email: { type: String, unique: true, sparse: true, required: true }, // Unique, but allow null
    password: { type: String, required: true }, // Hashed password
    image: { type: String, required: false },
    role: { type: String, default: 'user', required: true },
    phoneNumber: { type: String, unique: true, sparse: true, required: false }, // Unique, but allow null
    termsAccepted: { type: Boolean, required: true },
    newsletterSubscription: { type: Boolean, required: false },
});

// Prevent model redefinition during hot reloading.  VERY IMPORTANT.
const UserModel = models.User as mongoose.Model<User> || model<User>('User', userSchema);
export default UserModel;