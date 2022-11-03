const fs = require('fs')

/**
 * 
 * @param {string} path 
 * @param {boolen} dirent 
 * @returns {fs.Dirent[] | string[]}
 */
function lsr(path, dirent) {
    return fs.readdirSync(path, { encoding: 'ascii', withFileTypes: dirent }).map(t => {
        if ((dirent ? t : fs.lstatSync(`${path}/${dirent ? t.name : t}`)).isDirectory()) {
            return lsr(`${path}/${dirent ? t.name : t}`, dirent)
        } else {
            return `${path}/${dirent ? t.name : t}`
        }
    }).flat()
}

module.exports = lsr