import mongoose from 'mongoose';

const ImageSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
    },
    tags: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'Tag'
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const Image = mongoose.model('Image', ImageSchema);