import { Router } from 'express';
import { upload } from '../middlewares/upload';
import { uploadFile } from '../services/s3';
import { Image } from '../models/images';
import { Tag } from '../models/tags';
import util from 'util';
import fs from 'fs';

const unlinkFile = util.promisify(fs.unlink);

export const imageRouter = Router();

imageRouter.get('/', async (request, response) => {
    try {
        const images = await Image.find()
            .sort('-createdAt')
            .populate('tags', 'tagName');

        return response.json(images);
    } catch (err) {
        return response.status(400).json({ error: err.message });
    }
});

imageRouter.get('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const image = await Image.findOne({ _id: id })
            .populate('tags', 'tagName');

        if (!image) {
            throw new Error('Image not found');
        }

        return response.json(image);
    } catch (err) {
        return response.status(404).json({ error: err.message });
    }
});

imageRouter.get('/tags/:tag', async (request, response) => {
    try {
        const { tag } = request.params;

        const tagExists = await Tag.findOne({ tagName: tag.toLowerCase() });

        if (!tagExists) {
            throw new Error('Tag not found.');
        }

        const images = await Image.find({ tags: tagExists._id })
            .populate('tags', 'tagName');

        return response.json(images);
    } catch (err) {
        return response.status(400).json({ error: err.message });
    }
});

imageRouter.post('/', upload, async (request, response) => {
    try {
        const { file } = request;
        const { tag } = request.body;
        const result = await uploadFile(file);
        await unlinkFile(file.path);

        const tagExists = await Tag.findOne({ tagName: tag.toLowerCase() });

        if (!tagExists) {

            const newTag = new Tag({
                tagName: tag.toLowerCase(),
            });

            await newTag.save();

            const image = new Image({
                url: result.Location,
                tags: newTag._id
            });

            await image.save();

            return response.status(201).send();
        }

        const image = new Image({
            url: result.Location,
            tags: tagExists._id
        });

        await image.save();
        return response.status(201).send();
    } catch (err) {
        return response.status(400).json({ error: err.message });
    }
});

imageRouter.patch('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const { tag } = request.body;
        const image = await Image.findOne({ _id: id });

        const tagExists = await Tag.findOne({ tagName: tag.toLowerCase() });

        if (!image) {
            throw new Error('Image not found');
        }

        if (image.tags.length === 6) {
            throw new Error('Max 8 tags per photo');
        }

        if (!tagExists) {
            const newTag = new Tag({
                tagName: tag.toLowerCase()
            });

            await newTag.save();

            image.tags.push(newTag._id);

            await image.save();

            return response.status(204).send();
        }

        if (image.tags.some((imageTag) => imageTag.equals(tagExists._id))) {
            throw new Error('Image already has this tag');
        }

        image.tags.push(tagExists._id);
        await image.save();

        return response.status(204).send();
    } catch (err) {
        return response.status(400).json({ error: err.message });
    }
});

imageRouter.patch('/:id/tags/:tagId', async (request, response) => {
    try {
        const { id, tagId } = request.params;

        const image = await Image.findOne({ _id: id });

        if (!image) {
            throw new Error('Image not found');
        }

        const tagIndex = image.tags.findIndex(tag => tag.equals(tagId));

        if (tagIndex < 0) {
            throw new Error('Tag not present in image');
        }

        image.tags.splice(tagIndex, 1);

        await image.save();

        return response.status(204).send();
    } catch (err) {
        return response.status(400).json({ error: err.message }); ``;
    }
});

