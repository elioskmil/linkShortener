import { URL } from 'node:url';
import { query } from '../db/index.js';
import {client} from 'pg';

class shortLink {
    constructor() {
        try {
                this.shortURL = new URL(genShort(),'mad.r')
        } catch  ( error ) {
            return;
        }
    }
}

async function genShort()
{
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let uniqueCheck = new Client();
    await uniqueCheck.connect();
    while(true)
    {               //This should make sure the short link is unique before it's in the SQL db
        let short = '/';
        for(let i = 0; i < 4; i++)
        {
            let randChar = Math.floor(Math.random() * characters.length);
            short += characters.charAct(randChar);
        }
        if(!uniqueCheck.query(`SELECT EXISTS(SELECT 1 FROM links WHERE shortURL ILIKE \'mad.r/${short}\')`))//@TODO find a way that doesn't hold the program
            return short;
    }
}