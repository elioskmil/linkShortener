import { Pool, Client } from 'pg';
import { genShort } from './models/shortLink.js';

const pool = new Pool({user:'postgres'});
const createLinkTableQuery = `
CREATE TABLE IF NOT EXISTS links(
    linkID SERIAL PRIMARY KEY,
    origURL TEXT UNIQUE NOT NULL,
    shortURL TEXT UNIQUE NOT NULL,
    clicks INTEGER DEFAULT 0
);`;
const createSequenceQuery = `
CREATE SEQUENCE IF NOT EXISTS shortUrlAlt
    INCREMENT BY 4
    START WITH 1
    MINVALUE 0
    MAXVALUE 9999
    CYCLE;`;
const createAnalyticsQuery = `
CREATE TABLE analytics(
    changeID SERIAL PRIMARY KEY,
    editAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    oldShort TEXT NOT NULL,
    linkFK INTEGER REFERENCES links(linkID)
    );`;
const checkUniqueShortQuery =`SELECT EXISTS(SELECT 1 FROM links WHERE shortURL ILIKE \$1);`;
const addNewPairQuery =
 `INSERT INTO links (origURL, shortURL)
    VALUES (\$1, \$2)
    ON CONFLICT (shortUrl) DO UPDATE SET shortUrl = CONCAT('mad.r/', nextVal('shortUrlAlt'));`;
const updateShortQuery =
    `UPDATE links
    SET shortURL = \$1
    WHERE origURL = \$2;`;
const deletePairQuery =
    `DELETE FROM links
    WHERE origURL = \$1;`;

const getFromIDQuery =
    `SELECT FROM links
    WHERE linkID =\$1;`;

export class db {             //I'm not sure whether I need
    constructor(){    //this part yet.
        try{
            //this.name = dbName;
            startUp();
        } catch ( error ) {
            console.log('there was an error in db construct');
            console.log(error);
            return;
        }
    }
}

async function startUp()
{
    await query(createLinkTableQuery);
    await query(createSequenceQuery);
}


const query = async (text, params) => {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('executed query', {text, duration, rows: res.rowCount });
    return res;
}

const getClient = async () => {
    const client = await pool.connect();
    const query = client.query;
    const release = client.release;
    const timeout = setTimeout(() => {
        console.error('A client has been checked out for more than 5 seconds!');
        console.error(`The last executed query on this client was: ${client.lastQuery}`);
    }, 5000);
    //monkey patch
    client.query = (...args) => {
        client.lastQuery = args;
        return query.apply(client, args);
    } //end monkey patch
    client.release = () => {
        clearTimeout(timeout);
        //reverse the monkey patch;
        client.query = query;
        client.release = release;
        return release.apply(client);
    }
    return client;
}
/*async function checkUniqueShort(newShort)
{                                               //This doesn't actually check for duplicates, so we're using the sequence
    console.log('checkUniqueShort Start');      //As an alt in case of conflicts
    let rows = await query(checkUniqueShortQuery,[`mad.r/`+newShort]);
    console.log('printing rows');
    console.log(rows);
    if (rows === undefined || rows.length === 0)
        return false;
    return true;
}*/
export async function addLinkPair(newLink, newShort='')
{
    try{
        //console.log(newShort);
        let response = await query(addNewPairQuery,[newLink,`mad.r/`+newShort]);
        return response.rows;
    }
    catch(error)
    {
        console.log(error.code);
        if(error.code==='23505') //This should be the code for a unique conflict
        {                        //The ON CONFLICT in the query should handle shortURL conflicts
            if(error.constraint.includes('origURL'))
                console.log('Log: origURL already exists');
                return 'origURL already exists';
            return 'there was some other conflict';
        }
    }
}
export async function updateShort(originalURL, newShort='')
{
    let response = await query(updateShortQuery, [originalURL,'mad.r/'+newShort]);
    return response.rows;
}
export async function deletePair(originalURL)
{
    let response = await query(deletePairQuery, [originalURL]);
    return response.rows;
}
export async function getFromID(queryID)
{
    let response =  await query(getFromIDQuery, [queryID]);
    return response.rows;
}
export async function getAll()
{
    let response = await query('SELECT * FROM links', []);
    return response.rows;
}
export async function dbCheck()
{
    console.log('startup starting up');
    await startUp()
    //await checkUniqueShort(`risi`);
    //console.log('shortURL check')
    await addLinkPair(`https://youtu.be/JaPIWpe4psI`, `risi`);
    console.log('pair added');
    let printAll = await getAll();
    console.log('Print All 1 start')
    console.log(typeof(printAll));
    console.log(printAll);
    console.log('Printed All 1 end');
    let dupeResult = await addLinkPair(`https://youtu.be/JaPIWpe4psI`, `risi`);
    console.log('print dupe start');
    console.log(typeof(dupeResult));
    console.log(dupeResult);
    console.log('Printed dupe result');
    console.log('checking origURL dupe');
    dupeResult = await addLinkPair(`https://youtu.be/JaPIWpe4psI`, `tasl`);
    console.log('dupe added');
    console.log(dupeResult);
    console.log('Updating pair');
    await updateShort(`https://youtu.be/JaPIWpe4psI`, `tasl`);
    console.log('pair updated');
    printAll = await getAll();
    console.log('print all 2 start');
    console.log(printAll);
    console.log('Printed all 2 end');
    await deletePair(`https://youtu.be/JaPIWpe4psI`);
    console.log('pair deleted');
    printAll = await getAll();
    console.log('print all 3 start')
    console.log(printAll);
    console.log('Printed all 3 end');
    await addLinkPair(`https://youtu.be/JaPIWpe4psI`, `risi`);
    //console.log('Dropping table w/ cascade');
    //await query(`DROP TABLE links CASCADE`);
    //await query(`DROP SEQUENCE shortUrlAlt CASCADE`);
    return;
}