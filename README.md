# 🎯 YouTube Transcript Highlighter & Translation Injector

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![YouTube](https://img.shields.io/badge/Platform-YouTube-red.svg)](https://youtube.com)

A powerful JavaScript tool that enhances YouTube's transcript functionality by allowing you to highlight expressions, save translations, and display detailed translation data with interactive tooltips.

## ✨ Features

- 🎨 **Native Highlighting** - Uses CSS Highlight API for smooth, native browser highlighting
- 💾 **Per-Video Persistence** - Saves highlights and translations for each specific YouTube video
- 🗣️ **Rich Tooltips** - Hover over expressions to see definitions, pronunciations, synonyms, and translations
- ⌨️ **Keyboard Shortcuts** - Intuitive shortcuts for quick highlighting
- 🤖 **ChatGPT Integration** - Auto-generates prompts for translation requests
- 🌍 **Multi-Language Support** - Designed with Romanian translations but adaptable to any language
- 📱 **Cross-Browser Compatible** - Works in Chrome, Firefox, Safari, and Edge

## 🚀 Quick Start

### Method 1: Browser Console (Fastest)

1. Open any YouTube video and show the transcript
2. Open Developer Tools (`F12` or `Ctrl+Shift+I`)
3. Copy and paste the contents of [`injector.js`](injector.js) into the console
4. Press Enter to run

### Method 2: Bookmarklet

1. Copy the minified version from [`bookmarklet.js`](bookmarklet.js)
2. Create a new bookmark in your browser
3. Set the URL to the copied JavaScript code
4. Click the bookmark on any YouTube page

### Method 3: Userscript (Tampermonkey/Greasemonkey)

1. Install [Tampermonkey](https://www.tampermonkey.net/) browser extension
2. Copy the contents of [`injector.js`](injector.js)
3. Create a new userscript and paste the code
4. The script will automatically run on YouTube pages

## 📖 How to Use

### Basic Workflow

1. **Open YouTube video** and enable transcript
2. **Set context** - Select text and press `Ctrl + ↑` (highlighted in yellow)
3. **Mark expression** - Select word/phrase and press `Ctrl + Shift + ↑` (highlighted in orange)
4. **Get translations** - A ChatGPT prompt is auto-copied to your clipboard
5. **Inject results** - Paste ChatGPT's JSON response using `injectGPTTranslations()`
6. **View tooltips** - Hover over orange highlights to see translation details

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + ↑` | Set context (yellow highlight) |
| `Ctrl + Shift + ↑` | Mark expression (orange highlight) and pair with context |
| `Ctrl + ↓` | Clear all highlights for current video |

*Note: Use `Cmd` instead of `Ctrl` on Mac*

## 🔧 Translation Data Format

The tool expects translation data in this JSON format:

```json
[
  {
    "expression": "example phrase",
    "definition": "A sample expression used for demonstration",
    "ro_translation": "frază exemplu",
    "uk_pron": "ɪɡˈzæmpəl freɪz",
    "us_pron": "ɪɡˈzæmpəl freɪz",
    "synonyms": ["sample phrase", "demo text"],
    "en_phonetic_ro": "ig-zămpăl freiz"
  }
]
```

### Field Descriptions

- `expression` - The highlighted text/phrase
- `definition` - English definition
- `ro_translation` - Romanian translation (adaptable to any language)
- `uk_pron` - UK English pronunciation (IPA)
- `us_pron` - US English pronunciation (IPA)
- `synonyms` - Array of similar expressions
- `en_phonetic_ro` - Romanian-style phonetic pronunciation

## 🎯 Example Usage

1. **Select context**: "In this video, we'll learn about machine learning algorithms"
   - Press `Ctrl + ↑` → Text becomes yellow
   
2. **Select expression**: "algorithms"
   - Press `Ctrl + Shift + ↑` → Text becomes orange
   - Prompt automatically copied to clipboard

3. **Paste in ChatGPT**: Use the generated prompt to get translations

4. **Inject translations**:
   ```javascript
   injectGPTTranslations([
     {
       "expression": "algorithms",
       "definition": "A set of rules or instructions for solving a problem",
       "ro_translation": "algoritmi",
       "uk_pron": "ˈælɡərɪðəmz",
       "us_pron": "ˈælɡərɪðəmz",
       "synonyms": ["procedures", "methods", "processes"],
       "en_phonetic_ro": "ăl-go-ri-đăms"
     }
   ])
   ```

5. **View results**: Hover over "algorithms" to see the tooltip with all translation details

## 🛠️ Technical Details

### Browser Compatibility

- **Chrome/Edge**: Full support (CSS Highlight API native)
- **Firefox**: Full support (CSS Highlight API native)
- **Safari**: Full support (CSS Highlight API native)

### Storage

- Uses `localStorage` for persistence
- Per-video storage: `gpt-url-data-youtube-{videoId}`
- Global fallback: `gptExpressionPairs`

### Dependencies

- No external dependencies
- Pure vanilla JavaScript (ES6+)
- Uses modern browser APIs (CSS Highlight API, Clipboard API)

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) first.

### Development Setup

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/youtube-transcript-highlight.git`
3. Create a feature branch: `git checkout -b feature-name`
4. Make your changes and test on YouTube
5. Commit and push: `git commit -m "Description" && git push origin feature-name`
6. Open a Pull Request

### Reporting Issues

Please use the [GitHub Issues](https://github.com/fynlyn/youtube-transcript-highlight/issues) page to report bugs or request features.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Thanks to the YouTube team for providing transcript functionality
- Built with modern CSS Highlight API
- Inspired by language learning needs and translation workflows

## 🔗 Links

- [Live Demo](https://fynlyn.github.io/youtube-transcript-highlight/) (GitHub Pages)
- [Report Issues](https://github.com/fynlyn/youtube-transcript-highlight/issues)
- [Contribute](https://github.com/fynlyn/youtube-transcript-highlight/pulls)

---

⭐ **Star this repository if it helps you learn languages more effectively!**
