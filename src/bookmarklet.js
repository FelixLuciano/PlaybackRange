const fs = require("fs")
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
        let iconAttribute = ''

        if (this.#faviconFilename) {
            const icon = await this.#getBase64Favicon()

            iconAttribute = ` ICON="data:image/png;base64,${icon}"`
        }

        const template = `\
        <!DOCTYPE NETSCAPE-Bookmark-file-1>
        <META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
        <TITLE>Bookmarks</TITLE>
        <H1>Bookmarks</H1>
        <DL><p>
            <DT><A HREF="javascript:${code}"${iconAttribute}>${this.#name}</A>
        </DL><p>`
        const pad = template.indexOf("<")
        const unshifted = template.replace(new RegExp(`^\\s{${pad}}`, 'gm'), "")

        return unshifted
    }
}

module.exports = Bookmarklet
