import { URL } from 'node:url';
import { query } from '../db/index.js';

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

origLink.findAll = async function() {
    //@TODO pgsql query to return all original links
}

origLink.getLinksById = async function(reqID) {
    //@TODO pgsql query to return origLink by id
}

origLink.createLink = async function(reqURL) {
    let newLink = new origLink(reqURL);
    //@TODO request short link from shortLink.js as newShort
    //@TODO pgsql query to add newLink and newShort to db
}