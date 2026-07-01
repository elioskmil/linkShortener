import { URL } from 'node:url';
import { query } from '../pgsql.js';
import { genShort } from './shortLink.js';

class Link {
    constructor(longURL) {
        try {
            this.url = new URL(newUrl);
    } catch (error) {
        //@TODO Figure out error handling
        return;
        }
    }
}

async function getLinkByID(reqID) {
    //const query = 'SELECT * FROM links where linkID = $1';
    const result = await query(query, [id]);
    return result.rows[0];
};

createLink = async function(reqURL) {
    let newLink = new origLink(reqURL);
    
};
export function genShort()
{
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let short = '';
    for(let i = 0; i < 4; i++)  //The pgsql query addNewPairQuery should prevent duplicate short links from being added
    {
        let randChar = Math.floor(Math.random() * characters.length);
        short += characters.charAct(randChar);
    }
    return short;
}