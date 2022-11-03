const http = require('http')
const fs = require('fs')

/**
 * @param {http.IncomingMessage} req 
 * @param {http.ServerResponse} res 
 */
function handler(req, res) {
    try {
        if (req.url == '/') {
            res.writeHead(200, 'OK', { 'Content-Type': 'text/html' })
            fs.createReadStream(`pages/index.html`).pipe(res).on('drain', res.end)
        } else if (
            fs.existsSync(`pages/${req.url}`) &&
            fs.lstatSync(`pages/${req.url}`).isFile()
        ) {
            console.log(get(req.url))
            res.writeHead(200, 'OK', { 'Content-Type': get(req.url) })
            fs.createReadStream(`pages/${req.url}`).pipe(res).on('drain', res.end)
        }  else if (
            fs.existsSync(`pages/${req.url}.html`) &&
            fs.lstatSync(`pages/${req.url}.html`).isFile()
        ) {
            res.writeHead(200, 'OK', { 'Content-Type': 'text/html' })
            fs.createReadStream(`pages/${req.url}.html`).pipe(res).on('drain', res.end)
        } else if (
            fs.existsSync(`pages/${req.url}`) &&
            fs.lstatSync(`pages/${req.url}`).isSymbolicLink()
        ) {
            res.writeHead(302, 'OK', { 'Location': fs.readlinkSync(`pages/${req.url}`) })
            res.end()
        } else {
            res.writeHead(404, 'File Not Found')
            fs.createReadStream(`pages/errors/404.html`).pipe(res).on('drain', res.end)
        }
    } catch (err) {
        switch (Math.abs(err.errno)) {
            case os.constants.errno.EEXIST:
                res.writeHead(404, 'File Not Found')
                res.write(fs.readFileSync('pages/errors/404.html'))
                break;
            case os.constants.errno.EISDIR:
                res.writeHead(404, 'Canot return dir')
                res.write(fs.readFileSync('pages/errors/404.html'))
                break;
            default:
                console.log(err)
                res.writeHead(500, `Internal Error code ${err.errno}`)
                res.write(fs.readFileSync('pages/errors/500.html'))
                break;
        }
        res.end()
    }
}

module.exports = {
    special: true,
    path: 'default',
    handler
}