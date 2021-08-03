import mongoose from 'mongoose';

const TagsSchema = new mongoose.Schema({
    tagName: {
        type: String,
        required: true
    }
});

export const Tag = mongoose.model('Tag', TagsSchema);