// src/models/Interaction.ts
import mongoose, { Schema, model, models } from 'mongoose';
import { Interaction } from '@/types';

const interactionSchema = new Schema<Interaction>({
    _id: { type: Schema.Types.ObjectId, required: true, auto: true },
    contactId: { type: Schema.Types.ObjectId, ref: 'Contact', required: true }, // Reference to Contact
    type: { type: String, enum: ['call', 'email', 'meeting', 'note'], default: 'email', required: true },
    notes: { type: String, required: false },
    date: { type: Date, default: Date.now },
});
const InteractionModel = models.Interaction as mongoose.Model<Interaction> || model<Interaction>('Interaction', interactionSchema);
export default InteractionModel;