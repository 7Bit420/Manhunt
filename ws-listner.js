const lsr = require('./util/lsr')
const http = require('http')
const ws = require('ws')
const fs = require('fs')

const handlers = lsr('ws-handlers').map(t => require(t)).filter(t => t.handler)
const normalHandlers = handlers.filter(t=>!t.special)
const specials = new Map(handlers.filter(t => t.special).map(t => [t.path, t]))

/**
 * @param {ws.WebSocket} socket 
 * @param {http.IncomingMessage} req 
 */
function handler(socket, req) {
    (handlers.find(t => req.url.startsWith(t.path)).handler ?? specials.get('default').handler)(socket,req)
}

module.exports = {
    handler, 
    handlers: normalHandlers,
    specialHandlers: specials,
    allHandlers: handlers
}