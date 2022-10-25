import { encode } from "https://deno.land/std@0.160.0/encoding/base64.ts";
import { transform } from "https://deno.land/x/esbuild@v0.15.11/mod.js";

const source = await Deno.readTextFile("src/PlaybackRange.js");
const template = await Deno.readTextFile("src/template.html");

let { code } = await transform(source, {
  minify: true,
  platform: "browser",
  
});

let icon = encode(await Deno.readFile("assets/image/favicon.png"));

const data = template.replace("${code}", encodeURI(code)).replace("${icon}", icon);

try {
  await Deno.mkdir("dist");
} catch {}

await Deno.writeTextFile("dist/PlaybackRange.html", data);

Deno.exit();
