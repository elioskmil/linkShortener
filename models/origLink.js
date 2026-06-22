import { URL } from 'node:url';
import { query } from '../pgsql.js';
import { genShort } from './shortLink.js';

class origLink {
    constructor(longURL) {
        try {
            this.url = new URL(newUrl);
    } catch (error) {
        //@TODO Figure out error handling
        return;
        }
    }
}

origLink.getLinksById = async function(reqID) {
    const query = 'SELECT * FROM links where linkID = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
}

origLink.createLink = async function(reqURL) {
    let newLink = new origLink(reqURL);
    
}