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
    let short = '/';
    for(let i = 0; i < 4; i++)  //The pgsql query addNewPairQuery should prevent duplicate short links from being added
    {
        let randChar = Math.floor(Math.random() * characters.length);
        short += characters.charAct(randChar);
    }
    return short;
}