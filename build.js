(async function() {
    const fs = require("fs")
    const { transform } = require("esbuild")
    const { convert } = require("convert-svg-to-png")

    const source = await fs.readFileSync("src/PlaybackRange.js");
    const bookmarks = await fs.readFileSync("src/bookmarks.html");

    let { code } = await transform(source, {
        minify: true,
        platform: "browser",
    });

    const svg = fs.readFileSync("src/favicon.svg")
    const png = await convert(svg.toString())
    const icon = png.toString('base64')

    const data = bookmarks.toString().replace("${code}", encodeURI(code)).replace("${icon}", icon);

    try {
        fs.mkdirSync('build')      
    }
    catch (error) {
        if (error.code !== "EEXIST") throw error
    }

    fs.writeFileSync("build/PlaybackRange.html", data, {
        encoding: 'utf8',
        flag: 'w',
    })

    console.log("Done!")
})()
