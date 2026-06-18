import { Pool, Client } from 'pg'

const pool = new Pool({user:'postgres'});
const createLinkTableQuery = `
CREATE TABLE IF NOT EXISTS links(
    linkID SERIAL PRIMARY KEY,
    origURL TEXT NOT NULL,
    shortURL TEXT UNIQUE NOT NULL,
    clicks INTEGER DEFAULT 0
);`;
const createAnalyticsQuery = `
CREATE TABLE analytics(
    changeID SERIAL PRIMARY KEY,
    editAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    oldShort TEXT NOT NULL,
    linkFK INTEGER REFERENCES links(linkID)
    );`;
/*const checkIfExistsQuery =
    `SELECT EXISTS ( 
    SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = \$1
    );`;*/
const checkUniqueShortQuery =`SELECT EXISTS(SELECT 1 FROM links WHERE shortURL ILIKE \$1)`;
const addNewPairQuery =
 `INSERT INTO links (origURL, shortURL) ON CONFLICT DO NOTHING;
    VALUES (\$1, \$2)`;
const updateShortQuery =
    `UPDATE links
    SET shortURL = \$1
    WHERE origURL = \$2`;
const deletePairQuery =
    `DELETE FROM links
    WHERE origURL = \$1`;

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

function startUp()
{
    query(createLinkTableQuery);
}


export const query = async (text, params) => {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('executed query', {text, duration, rows: res.rowCount });
    return res;
}

export const getClient = async () => {
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
{
    let rows = await query(checkUniqueShortQuery,[`mad.r/`+newShort]);
    if (rows === undefined || rows.length === 0)
        return false;
    return true;
}*/
async function addLinkPair(newLink, newShort)
{
    try{
        await query(addNewPairQuery,[newLink,`mad.r/`+newShort]);
    }
    catch(error)
    {
        return;
    }
}
async function updateShort(originalURL, newShort)
{
    return await query(updateShortQuery, [originalURL,'mad.r/'+newShort]);
}
async function deletePair(originalURL)
{
    return await query(deletePairQuery, [originalURL]);
}
export async function dbCheck()
{
    console.log('startup starting up');
    await startUp()
    //await checkUniqueShort(`risi`);
    //console.log('shortURL check')
    await addLinkPair(`https://youtu.be/JaPIWpe4psI`, `risi`);
    console.log('pair added');
    await query(`SELECT * FROM links`);
    await updateShort(`https://youtu.be/JaPIWpe4psI`, `tasl`);
    console.log('pair updated');
    await query(`SELECT * FROM links`, []);
    await deletePair(`https://youtu.be/JaPIWpe4psI`);
    console.log('pair deleted');
    await query(`SELECT * FROM links`,[]);
    console.log('Printed all');
    return;
}