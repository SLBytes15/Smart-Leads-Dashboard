import express  from "express";
import mongoose from "mongoose";
import cors  from "cors";
import dotenv from 'dotenv';
import { log } from "node:console";
import authRoutes from './routes/authRoutes';
import leadRoutes from './routes/leadRoutes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

app.get('/', (req,res) => {
    res.json({message: 'The API is running'});
});

const PORT = process.env.PORT || 5000; 
const MONGO_URI = process.env.MONGO_URI || '';

mongoose.connect(MONGO_URI)
.then(() => {
console.log('MongoDB Connected');
app.listen(PORT, () => { console.log(`Server running on port ${PORT}`);
})
}).catch((err) => console.error('MongoDB connection error:', err));

export default app;
