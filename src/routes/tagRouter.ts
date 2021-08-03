import { Router } from 'express';
import { Tag } from '../models/tags';

export const tagRouter = Router();

tagRouter.get('/', async (request, response) => {
    try {
        const tags = await Tag.find();

        return response.json(tags);
    } catch (err) {
        return response.status(400).json({ error: err.message });
    }
});

tagRouter.post('/', async (request, response) => {
    try {
        const { tag } = request.body;
        const tagExists = await Tag.findOne({ tagName: tag.toLowerCase() });

        if (tagExists) {
            throw new Error('Tag already exists.');
        }

        const newTag = new Tag({
            tagName: tag
        });

        await newTag.save();

        return response.status(201).send();
    } catch (err) {
        return response.status(400).json({ error: err.message });
    }
});

tagRouter.delete('/:tagId', async (request, response) => {
    try {
        const { tagId } = request.params;

        const tagExists = await Tag.findOne({ _id: tagId });

        if (!tagExists) {
            throw new Error('Tag not found');
        }

        await Tag.findOneAndDelete({ _id: tagId });

        return response.status(204).send();
    } catch (err) {
        return response.status(404).json({ error: err.message });
    }
});