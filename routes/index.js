import links from './link.js'

const mountRoutes = (app) => {
    app.use('/links', links)
}

export default mountRoutes