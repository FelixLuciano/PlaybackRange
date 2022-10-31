const fs = require("fs")
const path = require("path")
const process = require('process')

const minimist = require('minimist')
const { transform } = require("esbuild")
const { convert } = require("convert-svg-to-png")


class Bookmarklet {
    #name = null
    #sourceFilename = null
    #faviconFilename = null

    constructor(name) {
        this.#name = name
    }

    setName(name) {
        this.#name = name
    }

    setSource(filename) {
        this.#sourceFilename = filename
    }

    setFavicon(filename) {
        this.#faviconFilename = filename
    }

    static makeFromArgv(args) {
        const aBookmarklet = new Bookmarklet(args.name)

        aBookmarklet.setSource(args.source)
        aBookmarklet.setFavicon(args.favicon)

        return aBookmarklet
    }

    async #getCode() {
        const source = fs.readFileSync(this.#sourceFilename)

        let { code } = await transform(source, {
            minify: true,
            platform: "browser",
        })

        return code
    }

    async #getURLSafeCode() {
        return encodeURI((await this.#getCode()).toString())
    }

    async #getFavicon() {
        const svg = fs.readFileSync(this.#faviconFilename)

        return convert(svg.toString())
    }

    async #getBase64Favicon() {
        return (await this.#getFavicon()).toString('base64')
    }

    async make() {
        const code = await this.#getURLSafeCode()
        const icon = await this.#getBase64Favicon()
        const template = `\
        <!DOCTYPE NETSCAPE-Bookmark-file-1>
        <META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
        <TITLE>Bookmarks</TITLE>
        <H1>Bookmarks</H1>
        <DL><p>
            <DT><A HREF="javascript:${code}" ICON="data:image/png;base64,${icon}">${this.#name}</A>
        </DL><p>`
        const pad = template.indexOf("<")
        const unshifted = template.replace(new RegExp(`^\\s{${pad}}`, 'gm'), "")

        return unshifted
    }
}


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
    const args = minimist(process.argv)
    const code = await main(args)

    process.exit(code)
})()
