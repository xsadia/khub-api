import mongoose from 'mongoose';
import { ITag } from './tags';

interface IImage extends mongoose.Document {
    url: string;
    tags: Array<ITag['_id']>;
}

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

export const Image = mongoose.model<IImage>('Image', ImageSchema);