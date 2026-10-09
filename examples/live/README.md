# Live deck example

A single-deck project using `tiger-site-gen-reveal` (see `examples/src/mysite/LiveDemo.scala`):
one JVM builds, watches, renders unsaved VS Code drafts and serves the deck with
automatic refresh. reveal.js is bundled in the theme; no npm install is needed.

```sh
./mill examples.runMain mysite.liveDemo dev               # http://127.0.0.1:8123/demo-deck/
./mill examples.runMain mysite.liveDemo build --display
./mill examples.runMain mysite.liveDemo serve --display   # http://127.0.0.1:8127/demo-deck/
```

Content studio is at `http://127.0.0.1:8123/__author/` and opens the deck's slides.
This directory is the site root: sources in `content/demo-deck/`, host assets in
`public/`, output in `dist/` or `dist-display/`, and `.live-preview.json` while the
server runs.

Live editing is not specific to decks: `./mill blog.runMain blog.liveBlog` serves the
Breeze blog (`blog/_docs`) the same way at http://127.0.0.1:8123/articles/ with the
generic `LiveSite`.
