import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import dbConnect from './config/mongoose.config.js';
import userRouter from './routes/user.routes.js';
import tweetRouter from './routes/tweet.routes.js';
import commentRouter from './routes/comment.routes.js'

const app = express()

app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials: true, origin: 'http://localhost:5173'}));

app.use('/api', userRouter);
app.use('/api', tweetRouter);
app.use('/api', commentRouter);

dotenv.config()

const PORT = process.env.PORT;

dbConnect();

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
})