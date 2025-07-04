import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
    const response = {
        status: 'ok',
        message: 'Server is running!',
        timestamp: new Date().toISOString(),
    };
    res.json(response);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
