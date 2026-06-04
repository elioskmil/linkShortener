import express from 'express'
import mountRoutes from './routes.js'

const app = express()
mountRoutes(app)