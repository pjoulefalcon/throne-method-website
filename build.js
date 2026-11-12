/*
  Turns the editable files in /content into js/data.js, which the site reads.
  Cloudflare runs this automatically every time you save in the editor
  (build command: node build.js). No packages needed.
*/
const fs = require("fs");
const path = require("path");

const read = (f) => JSON.parse(fs.readFileSync(path.join(__dirname, "content", f), "utf8"));

// The editor saves uploads as "/images/...". Make them relative so the site
// also works when opened straight from a folder on your computer.
const fixPaths = (v) =>
  typeof v === "string" ? v.replace(/^\/images\//, "images/")
  : Array.isArray(v) ? v.map(fixPaths)
  : v && typeof v === "object" ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, fixPaths(x)]))
  : v;

const slugify = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const data = fixPaths({
  SITE: read("settings.json"),
  RIDERS: read("riders.json").filter((r) => r.name),
  PARTNERS: read("partners.json"),
  EVENTS: read("events.json")
    .filter((e) => e.title)
    .map((e) => ({ ...e, slug: e.slug || slugify(e.title) }))
    .sort((a, b) => String(a.date).localeCompare(String(b.date))),
});

const out =
  "/* AUTO-GENERATED from /content by build.js — edit the files in /content instead. */\n" +
  Object.entries(data).map(([k, v]) => `const ${k} = ${JSON.stringify(v, null, 2)};`).join("\n\n") + "\n";

fs.writeFileSync(path.join(__dirname, "js", "data.js"), out);
console.log(`Built js/data.js: ${data.RIDERS.length} riders, ${data.EVENTS.length} events`);
