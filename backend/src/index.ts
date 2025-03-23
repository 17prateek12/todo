import express from 'express';
import dotenv from 'dotenv'
import { connectionDb } from './config/dbConfig';
import userRoutes from './routers/userRouter';
import todoRoutes from './routers/todoRouter';
import cors from 'cors';

dotenv.config()
const app = express();
connectionDb();

const PORT = process.env.PORT;
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('src/uploads'));


app.get('/', (req, res) => {
    res.send('Hello, TypeScript with Express!');
});

app.use('/api/user',userRoutes);
app.use('/api/todos', todoRoutes);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

