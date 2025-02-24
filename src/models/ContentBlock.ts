// src/models/ContentBlock.ts
import mongoose, { Schema, model, models } from 'mongoose';
import { ContentBlock } from '@/types';

const contentBlockSchema = new Schema<ContentBlock>({
    _id: { type: Schema.Types.ObjectId, required: true, auto: true },
    pageId: { type: Schema.Types.ObjectId, ref: 'Page', required: true }, // Reference to Page
    type: { type: String, required: true },
    data: { type: Schema.Types.Mixed, required: true }, // Can be any type
    order: { type: Number, required: true },
});

const ContentBlockModel = models.ContentBlock as mongoose.Model<ContentBlock> || model<ContentBlock>('ContentBlock', contentBlockSchema);
export default ContentBlockModel;