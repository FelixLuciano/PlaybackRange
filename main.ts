import { transform } from "https://deno.land/x/esbuild@v0.15.11/mod.js";

const source = await Deno.readTextFile("src/PlaybackRange.js");
const template = await Deno.readTextFile("src/template.html");

const { code } = await transform(source, {
  minify: true,
  platform: "browser",
  
});

const data = template.replace("${code}", code.replaceAll("\n", "").replaceAll(/\s+/g, " ").replaceAll("\"", "'"));

try {
  await Deno.mkdir("dist");
} catch {}

await Deno.writeTextFile("dist/PlaybackRange.html", data);

Deno.exit();
