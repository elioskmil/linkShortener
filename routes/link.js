import Router from 'express-promise-router'
import express from 'express';
import { getAll } from '../pgsql.js'
//import {query, getClient} from '../db/index.js'
const app = express();
const router = new Router()

export default router

/*router.get('/:id', async (req, res) => {
    const { id } = req.params
    const { rows } = await db.query('SELECT * FROM users WHERE id =$1', [id])
    res.send(rows[0])
})*/


router.get('/api/links', async (req, res) => {
    let links = await getAll();
    res.json(links);
});

//router.get('/api/links')