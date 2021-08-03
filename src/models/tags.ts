import mongoose from 'mongoose';

export interface ITag extends mongoose.Document {
    tagName: string;
}

const TagsSchema = new mongoose.Schema({
    tagName: {
        type: String,
        required: true
    }
});

export const Tag = mongoose.model<ITag>('Tag', TagsSchema);