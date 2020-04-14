const cors = require('cors')
const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const Keycloak = require('keycloak-connect')
const proxy = require('express-http-proxy');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var xhr = new XMLHttpRequest();

const app = express()
app.use(bodyParser.json())

app.use(cors())

const memoryStore = new session.MemoryStore()

app.use(
    session({
        secret: '6d44fd6e-982f-4e9d-9d18-ef95cd064bc2',
        resave: false,
        saveUninitialized: true,
        store: memoryStore
    })
)

var keycloak = new Keycloak({
    store: memoryStore
})

app.use(
    keycloak.middleware({
        logout: '/logout',
        admin: '/'
    })
)

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS")
    res.header('Access-Control-Allow-Credentials', true)
    if (req.url === '/favicon.ico') {
        res.writeHead(200, {'Content-Type': 'image/x-icon'} )
        res.end()
        return
    }
    next()
})

app.use('/keycloak.json', express.static('keycloak.json'));

app.use('/client.js', express.static('public/videos/client.js'));

app.use('/', keycloak.protect(), express.static('public/videos'));

app.use('/proxy', proxy('www.instagram.com'))

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}...`))
