# The Beatles — Interactive Presentation

An English, 10-slide presentation about The Beatles, their history and legacy, and the film *Yesterday*. The original research was supplied in Portuguese and translated into concise English slide text and a separate spoken script.

## Visual concept

The deck treats each slide as a page from a vintage music scrapbook. Aged paper, monochrome photography, record and ticket motifs, sheet-music details, and asymmetrical photo layers draw from the three supplied “estetica beatles” references. The opening slide also includes the school, date, student names, and teacher in a compact class-information card. The palette stays with cream, charcoal, muted green, sepia, and small red accents.

## Project files

- `index.html` — the complete interactive slide presentation.
- `styles.css` — 16:9 slide layouts, responsive styles, and visual effects.
- `app.js` — slide navigation, controls, transitions, and accessibility behavior.
- `server.js` — optional dependency-free local static server.
- `presentation-script.md` — the English speaking script for all ten slides.
- The supplied `foto dos beatles…` and `estetica beatles…` image files in this folder are used directly by the website.

## Open and present

1. Keep the image files beside `index.html`.
2. Open `index.html` in a modern desktop browser. If you prefer a local server, open PowerShell in this folder, run `node server.js`, then visit `http://127.0.0.1:8000`.
3. Select the full-screen button or press **F**. Use **→**, **Space**, or the on-screen arrow to advance; use **←** to go back. **Home** and **End** jump to the first and last slides. Click the progress markers to jump to a slide.
4. Read `presentation-script.md` while presenting. The script is separate so it can be printed or kept open on another screen.

GSAP 3.13 is loaded from jsDelivr for the coordinated slide transitions. The deck’s navigation and a Web Animations fallback still work if that CDN is unavailable. Google Fonts are an optional typographic enhancement; local system fonts are specified as fallbacks. The local server uses only Node.js built-in modules and serves this folder on the loopback address.

## Before the presentation

- Open the site once on the computer connected to the projector.
- Check that the slide counter, chapter markers, arrow keys, Space, and full-screen button work.
- Confirm all photos load and that the text is legible from the back of the room.
- Keep the English script available for each slide.
- Set the browser zoom to 100% and silence notifications before presenting.
