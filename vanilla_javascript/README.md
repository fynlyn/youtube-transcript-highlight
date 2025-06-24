# YouTube Transcript Highlighter & Translation Injector

This JavaScript tool enhances YouTube's transcript view:  
- Lets you select and highlight expressions and their contexts in a video transcript.  
- Saves, restores, and manages highlights and translations on a per-video basis.  
- Lets you inject detailed translation data for expressions, viewable as tooltips.  
- Designed for easy use via browser console, bookmarklet, or as a userscript.

## Features

- **CSS Highlight API** for native highlighting.
- **Per-Video Persistence:** Highlights and translations are saved per video (using localStorage).
- **Tooltip on Hover:** Shows translations, definitions, pronunciations, synonyms, etc.
- **Convenient Keyboard Shortcuts:**
  - `Ctrl + ↑` — Mark selected text as context (yellow highlight).
  - `Ctrl + Shift + ↑` — Mark selection as expression (orange highlight) and link to context.
  - `Ctrl + ↓` — Clear highlights/translations for current video.

- **Prompt Generation:** Auto-copies a ChatGPT-friendly prompt for translating your selected expressions.
- **Translation Injection:** Call `injectGPTTranslations(array)` in the console to add translation data.

## Getting Started

### Option 1: Paste in Browser Console

1. Open a YouTube video and show the transcript.
2. Copy the contents of [`injector.js`](injector.js) and paste into your browser console.

### Option 2: Bookmarklet

1. Minify [`injector.js`](injector.js).
2. Prefix with `javascript:` and save as a bookmark.
3. Click the bookmark on any YouTube video page.

### Option 3: Userscript

Wrap the script in a [userscript header](https://wiki.greasespot.net/Metadata_Block) and install via Tampermonkey/Greasemonkey.

## Usage

1. **Open a YouTube video and show its transcript.**
2. **Select the context:**  
   - Select text in the transcript, press `Ctrl + ↑` (or `Cmd + ↑` on Mac).  
   - You'll see the context highlighted yellow.
3. **Select an expression:**  
   - Select the word/phrase to translate, press `Ctrl + Shift + ↑`.  
   - It will become orange.
   - The pair is saved and a prompt is copied to your clipboard.
4. **Paste the prompt into ChatGPT** to get translations and details.
5. **Inject translations:**  
   - In ChatGPT, copy the returned JSON array.
   - In the console, call:  
     ```js
     injectGPTTranslations(YOUR_JSON_ARRAY)
     ```
   - Now, hover the orange highlights to see translation details.

## Keyboard Shortcuts

| Shortcut                | Action                                 |
|-------------------------|----------------------------------------|
| `Ctrl + ↑`              | Set context (yellow)                   |
| `Ctrl + Shift + ↑`      | Set expression (orange) and pair it    |
| `Ctrl + ↓`              | Clear highlights for current video     |

## How It Works

- Highlights are stored in the browser's localStorage.
- Each video (by ID) has its own saved data.
- Translation data is shown in a tooltip when hovering an orange highlight.

## Translation Data Format

Each translation object should look like:

```json
{
  "expression": "example",
  "definition": "A sample expression",
  "ro_translation": "exemplu",
  "uk_pron": "ɪɡˈzæmpəl",
  "us_pron": "ɪɡˈzæmpəl",
  "synonyms": ["sample", "instance"],
  "en_phonetic_ro": "ig-zămpăl"
}
```

## License

MIT
