const lsr = require('./util/lsr')
const http = require('http')
const fs = require('fs')


const handlers = lsr('http-handlers').map(t => require(`${process.cwd()}/${t}`)).filter(t => t.handler)
const normalHandlers = handlers.filter(t=>!t.special)
const specials = new Map(handlers.filter(t => t.special).map(t => [t.path, t]))

/**
 * @param {http.IncomingMessage} req 
 * @param {http.ServerResponse} res 
 */
function handler(req, res) {
    (handlers.find(t => req.url.startsWith(t.path)).handler ?? specials.get('default').handler)(req,res)
}

module.exports = {
    handler, 
    handlers: normalHandlers,
    specialHandlers: specials,
    allHandlers: handlers
}