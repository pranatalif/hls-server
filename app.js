const http = require('http')
const cors = require('cors')
const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const Keycloak = require('keycloak-connect')
const proxy = require('express-http-proxy')
const request = require('request')

const app = express()
app.use(bodyParser.json())

app.use(cors())

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

request.get('http://localhost:8080/', function (error, response, body) {
  if (error || response.statusCode != 200) {
    console.log(error) // Do something with your error
  }

  // If no errors, this code will be executed
  // Write in file
  
})

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
    next()
})

app.use('/node_modules/keycloak-js/', express.static('node_modules/keycloak-js'))

app.use('/keycloak.json', express.static('keycloak.json'));

app.use('/client.js', express.static('public/videos/client.js'));

app.use('/', keycloak.protect(), express.static('public/videos'));

app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
})

// error handler middleware
app.use((error, req, res, next) => {
    res.status(error.status || 500).send({
        error: {
            status: error.status || 500,
            message: error.message || 'Internal Server Error',
        },
    })
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}...`))
