const http = require('http')
const cors = require('cors')
const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const Keycloak = require('keycloak-connect')
const proxy = require('express-http-proxy')

const app = express()
app.use(bodyParser.json())

app.use(cors())

// function getRoute(req) {
//     const route = req.route ? req.route.path : '' // check if the handler exist
//     const baseUrl = req.baseUrl ? req.baseUrl : '' // adding the base url if the handler is a child of another handler
 
//     return route ? `${baseUrl === '/' ? '' : baseUrl}${route}` : 'unknown route'
// }

// app.use((req, res, next) => {
//     res.on('finish', () => {
//         console.log(`${req.method} ${req.url} ${res.statusCode}`) 
//     })
//     next()
// })

const memoryStore = new session.MemoryStore()

app.use(
    session({
        secret: '9ed4c2fb-89ca-4ed3-9483-93afcc533e16',
        resave: false,
        saveUninitialized: true,
        store: memoryStore
    })
)

var keycloak = new Keycloak({
    scope: 'offline_access',
    store: memoryStore
})

app.use(
    keycloak.middleware({
        logout: '/logout',
        admin: '/'
    })
)

app.use(function(req, res, next) {
    //const { statusCode } = res
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS")
    res.header('Access-Control-Allow-Credentials', true)
    if (req.url === '/favicon.ico') {
        res.writeHead(200, {'Content-Type': 'image/x-icon'} )
        res.end()
        return
    }
})

app.use('/keycloak.json', express.static('keycloak.json'));

app.use('/client.js', express.static('public/videos/client.js'));

app.use('/', keycloak.protect(), express.static('public/videos'));

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}...`))
