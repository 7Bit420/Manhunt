const httpHandles = require('./http-listner')
const wsHandles = require('./ws-listner')
const https = require('https')
const http = require('http')
const ws = require('ws')
const fs = require('fs')

process.chdir(__dirname)

const httpServer = http.createServer()
httpServer.on('request', httpHandles.handler)

/*
const httpsServer = https.createServer({
    ca: fs.readFileSync('config/certs/ca.pem'),
    cert: fs.readFileSync('config/certs/cert.pem'),
    key: fs.readFileSync('config/certs/key.pem'),
})
httpsServer.on('request', httpHandles.handler)
// */

const wsServer = new ws.WebSocketServer({httpServer})
wsServer.on('connection', wsHandles.handler)

httpServer.listen(80)
// httpsServer.listen(443)
