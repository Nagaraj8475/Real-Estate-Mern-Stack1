import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { userRoute } from './routes/userRoute.js';
import { residencyRoute } from './routes/residencyRoute.js';
import connectDB from './config/db.js';
import morgan from 'morgan'
dotenv.config()
connectDB();

const app = express();

const PORT = process.env.PORT || 8000;

app.use(express.json())
app.use(morgan('dev'))
app.use(cookieParser())
app.use(cors())

app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`);
});

app.use('/api/user', userRoute)
app.use("/api/residency", residencyRoute)