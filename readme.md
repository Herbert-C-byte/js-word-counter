# Word Counter

A small, responsive word & character counter with live updates, accessible markup, and simple controls.

## Features

- Live word and character counts (debounced for performance)
- Animated counters for smooth updates
- Autosizing textarea with max-height based on viewport
- Copy and Clear buttons with visual feedback
- Responsive layout and improved accessibility

## Usage

- Open [index.html](index.html) in a browser (double-click or open in your editor preview).
- Or run a simple local server and visit `http://localhost:8000`:

```powershell
# from project root
python -m http.server 8000
# then open http://localhost:8000 in your browser
```

## Controls

- `Count` — manually update the stats (also updates live while typing)
- `Copy` — copies textarea contents to clipboard with feedback
- `Clear` — clears the textarea and resets counts

## Development

- Files: [index.html](index.html), [styles.css](styles.css), [script.js](script.js)
- Feel free to open the project in your editor, tweak styles or behavior, and run the page locally.

## Credits

Created by Herbert — small project made out of boredom.
