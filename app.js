import express from 'express';
import mountRoutes from './routes/index.js'
import { Client, Pool } from 'pg';
import { db, dbCheck, getAll } from './pgsql.js';

const createTableText = `
CREATE TEMP TABLE links(
    id SERIAL PRIMARY KEY,
    origURL TEXT NOT NULL,
    shortURL TEXT UNIQUE NOT NULL,
    lastEdit TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`
const pool = new Pool({user:'postgres'});
pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

//Create temp table
/*async function createTestTable() {
    await pool.query(createTableText);
    console.log('createTempTable() finished.');
}

//insert test link
async function testLinkTable() {
    let now = new Date();
    const insertQuery = {
        text: `INSERT INTO links(origURL, shortURL) VALUES ($1, $2)`,
        values: ['https://youtu.be/JaPIWpe4psI', 'mad.r/risi'],
    };
    const res = await pool.query(insertQuery);
    console.log('testLinkTable() finished.');
    console.log(res.rows[0]);
}

//read the row back out
async function printTestLinkTable() {
    const result = await pool.query('SELECT * FROM links');
    console.log(result.rows);
}*/

/*async function dbCheck()
{
    let testDB = new db(); //This should run db.startup()
    console.log('db object created');
    console.log(testDB.checkUniqueShort(`mad.r/risi`));
    console.log('shortURL check')
    testDB.addLinkPair(`https://youtu.be/JaPIWpe4psI`, `mad.r/risi`);
    console.log('pair added');
    testDB.query(`SELECT * FROM links`);
    testDB.updateShort(`https://youtu.be/JaPIWpe4psI`, `mad.r/tasl`);
    console.log('pair updated');
    testDB.query(`SELECT * FROM LINKS`);
    testDB.deletePair(`https://youtu.be/JaPIWpe4psI`);
    console.log('pair deleted');
    testDB.query(`SELECT * FROM links`);
}*/

const app = express();
mountRoutes(app);

app.get('/',(req, res) => {
    res.send('Welcome to my API');
});

app.get('/links', async (req,res) =>  {
    let allLinks = await getAll();
    res.send(allLinks);
});

app.listen(8080, async () => {
    console.log('REST API server running on port 8080');
    console.log('Attempting to create test table...');
    /*createTestTable();
    console.log('Function called. Attempting to add test link pair...');
    testLinkTable();
    console.log('Function called. Attempting to print test table');
    printTestLinkTable();*/
    //let testDB = new db();
    dbCheck();
    //await pool.end();
});