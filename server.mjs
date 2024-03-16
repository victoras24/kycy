import express from 'express';
import { Pool } from 'pg';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const app = express();
const port = 3000;

const corsOptions = {
    origin: 'https://kycy.netlify.app'
};

app.use(cors(corsOptions));

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST, // Provide the correct host
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT // Provide the correct port
});

app.get('/api/organisations', async (req, res) => {
    const { keyword } = req.query;

    try {
        const query = `
            SELECT *
            FROM organisations
            WHERE LOWER(organisation_name) LIKE LOWER($1)
        `;
        const result = await pool.query(query, [`%${keyword}%`]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error while fetching organisations:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/', (req, res) => {
    res.send('Welcome to the API!');
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
