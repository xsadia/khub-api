import express from 'express';
import mongoose from 'mongoose';
import { imageRouter } from './routes/imageRoutes';
import cors from 'cors';
import { tagRouter } from './routes/tagRouter';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/images', imageRouter);
app.use('/tags', tagRouter);

mongoose.connect('mongodb://localhost:27017/khub', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});

mongoose.connection.on("error", err => {
    console.log("err", err);
});

mongoose.connection.on("connected", (err, res) => {
    console.log("mongoose is connected");
});

app.listen(3333, () => {
    console.log('http://localhost:3333');
});