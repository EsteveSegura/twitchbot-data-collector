const argv = require('minimist')(process.argv.slice(2))

const time = argv.t || argv.time || 5
const autoSave = argv.a || argv.autosave || false
const page = argv.p || argv.pages || 10
const offset = argv.o || argv.offset || 0
const debug = argv.d || argv.debug || false
const searchterm = argv.s || argv.searchterm || 'hi'
const language = argv.l || argv.language || 'en'

if(argv.h || argv.help){
    console.log(`LIST COMMANDS\n-t --time: time to perform auto save, default: 5\n-a --autosave: auto save data, needs every 5 mins or custom via -t\n-p --page: number of pages to scrape in twitch, default: 10\n-o --offset: page to start scraping, default: 0\n-d --debug: allow debug on chat\n-s --searchterm: find every time that someone says on twitch 'x' term\n-l --language: pick language to scrape, default: en`)
    process.exit(0)
}

module.exports = { time, autoSave, page, offset, debug, searchterm,language }