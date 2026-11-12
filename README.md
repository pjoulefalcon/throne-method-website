# Throne Method Racing website

## Editing the site
Once the site is live, go to **app.pagescms.org**, sign in with GitHub, and pick this site.
You'll see four sections: **Events, Riders, Partners, Site settings**. Edit, upload photos, press **Save**,
and the live site updates by itself within a minute or two.

## Where things live
- `content/` – all the words, dates and photo links (this is what the editor changes)
- `images/` – photos and logos
- `index.html`, `riders.html`, `partners.html`, `event.html` – the page layouts
- `css/style.css` – colours, fonts, spacing
- `js/data.js` – made automatically from `content/` by `build.js` (don't edit by hand)

## Hosting (Cloudflare Pages)
- Build command: `node build.js`
- Output directory: `/` (the root folder)

## Previewing on your computer
Double-click `index.html`. If you change anything in `content/` by hand, run `node build.js` first.
