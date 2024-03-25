import express from 'express';
import pkg from 'pg';
const { Pool } = pkg;

import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config()

const app = express();
const port = 3000;

const corsOptions = {
    origin: 'https://kycy.netlify.app'
};

app.use(cors(corsOptions));

app.use((req, res, next) => {
    if (req.url.endsWith('.js')) {
        res.setHeader('Content-Type', 'text/javascript');
    }
    next();
});

const pool = new Pool({
    user: "esaakidis",
    host: "/var/run/postgresql",
    database: "kycy",
    password: process.env.DB_PASSWORD,
    port: "5432"
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
