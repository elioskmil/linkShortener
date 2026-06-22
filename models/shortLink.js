import { URL } from 'node:url';
//import db from '../pgsql.js';
import { Client } from 'pg';

class shortLink {
    constructor() {
        try {
                this.shortURL = new URL(genShort(),'mad.r')
        } catch  ( error ) {
            return;
        }
    }
}

export function genShort()
{
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    while(true)
    {               //This should make sure the short link is unique before it's in the SQL db
        let short = '/';
        for(let i = 0; i < 4; i++)
        {
            let randChar = Math.floor(Math.random() * characters.length);
            short += characters.charAct(randChar);
        }
        if(!db.checkUniqueShort(short))//@TODO find a way that doesn't hold the program
            return short;
    }
}