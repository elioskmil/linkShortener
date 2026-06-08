import express from 'express'
import mountRoutes from './routes/index.js'
import { Client } from 'pg';

const createTempTableText = `
CREATE TEMP TABLE links(
    idCol ID,
    origURLCol ORIGURL
    shortURLCol SHORTURL
    timestampCol TIMESTAMP
);
`

const client = new Client();
//Create temp table
await client.query(createTempTableText);

//insert test link
const now = new Date();
const insertText = 'INSERT INTO links(idCol, origURLCol, shortURLCol, timestampCol) VALUE'
await client.query(insertText, [666777, 'https://youtu.be/JaPIWpe4psI', 'blehweh', now]);

//read the row back out
const result = await client.query('SELECT * FROM links');

console.log(result.rows);

const app = express();
mountRoutes(app);