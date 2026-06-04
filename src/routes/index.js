import links from './link.js'
import ids from './ids.js'

const mountRoutes = (app) => {
    app.use('/links', links)
    app.use('/ids', ids)
}

export default mountRoutes