const fs = require("fs")
const path = require("path")
const process = require('process')

const minimist = require('minimist')

const Bookmarklet = require('./bookmarklet.js')


async function main (argv) {
    const playbackrange = Bookmarklet.makeFromArgv(argv)
    const data = await playbackrange.make()
    
    try {
        fs.mkdirSync(path.dirname(argv.output))
    }
    catch (error) {
        if (error.code !== "EEXIST") throw error
    }

    fs.writeFileSync(argv.output, data, {
        encoding: 'utf8',
        flag: 'w',
    })

    console.log("Done!")

    return 0
}


(async function () {
    const args = minimist(process.argv, {
        string: ['name', 'source', 'favicon', 'output'],
        default: {
            name: '',
            favicon: false,
        }
    })
    const code = await main(args)

    process.exit(code)
})()
