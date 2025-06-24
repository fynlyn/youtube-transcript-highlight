// ==UserScript==
// @name         YouTube Transcript Highlighter & Translation Injector
// @namespace    https://github.com/yourusername/youtube-transcript-highlight
// @version      1.0.0
// @description  Highlight, save, and inject translations for YouTube transcript expressions. Paste in console, use as userscript, or as a bookmarklet.
// @author       yourusername
// @match        https://www.youtube.com/watch*
// @grant        none
// ==/UserScript==

(() => {
  // ── 1. Config & State ──────────────────────────────────────────
  const CONTEXT_HIGHLIGHT_NAME    = 'gpt-context-highlight';
  const EXPRESSION_HIGHLIGHT_NAME = 'gpt-expression-highlight';
  const GLOBAL_STORAGE_KEY        = 'gptExpressionPairs';
  const URL_STORAGE_PREFIX        = 'gpt-url-data-';
  const TOAST_CLASS               = 'gpt-toast-notification';

  let highlightPairs = [];
  let lastContextText = null;
  let translationData = new Map();
  let activeExpressionRanges = [];
  let currentStorageKey = GLOBAL_STORAGE_KEY;

  // ── 2. Highlighting Engine ─────────────────────────────────────
  function findTextRanges(textToFind) {
    if (!textToFind) return [];
    const ranges = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while (node = walker.nextNode()) {
      let startIndex = 0;
      while ((startIndex = node.nodeValue.indexOf(textToFind, startIndex)) !== -1) {
        const range = document.createRange();
        range.setStart(node, startIndex);
        range.setEnd(node, startIndex + textToFind.length);
        ranges.push(range);
        startIndex += textToFind.length;
      }
    }
    return ranges;
  }

  function renderAllHighlights() {
    CSS.highlights.clear();
    activeExpressionRanges = [];

    if (highlightPairs.length === 0 && !lastContextText) return;

    const contextHighlight = new Highlight();
    const expressionHighlight = new Highlight();

    for (const pair of highlightPairs) {
      findTextRanges(pair.context).forEach(range => contextHighlight.add(range));
      const exprRanges = findTextRanges(pair.expression);
      exprRanges.forEach(range => {
        expressionHighlight.add(range);
        activeExpressionRanges.push({ range, text: pair.expression });
      });
    }

    if (lastContextText) {
      findTextRanges(lastContextText).forEach(range => contextHighlight.add(range));
    }

    CSS.highlights.set(CONTEXT_HIGHLIGHT_NAME, contextHighlight);
    CSS.highlights.set(EXPRESSION_HIGHLIGHT_NAME, expressionHighlight);
  }

  // ── 3. Tooltip Logic ───────────────────────────────────────────
  const tooltip = document.createElement('div');
  Object.assign(tooltip.style, {
    position: 'absolute', display: 'none', background: '#333', color: 'white', padding: '10px 15px',
    borderRadius: '8px', fontSize: '14px', fontFamily: 'sans-serif', lineHeight: '1.6',
    whiteSpace: 'pre-line', maxWidth: '300px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
    zIndex: 1000000, pointerEvents: 'none', border: '1px solid #555',
  });
  document.body.appendChild(tooltip);

  document.addEventListener('mousemove', (e) => {
    let hoveredData = null;
    for (const { range, text } of activeExpressionRanges) {
      const rects = range.getClientRects();
      for (const rect of rects) {
        if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
          hoveredData = translationData.get(text);
          break;
        }
      }
      if (hoveredData) break;
    }

    if (hoveredData) {
      const lines = [
        `📖 Expression: "${hoveredData.expression}"`,
        `➤ Definition: ${hoveredData.definition || 'N/A'}`,
        `🇷🇴 RO: ${hoveredData.ro_translation || 'N/A'}`,
        `🇬🇧 UK Pron: ${hoveredData.uk_pron || 'N/A'}`,
        `🇺🇸 US Pron: ${hoveredData.us_pron || 'N/A'}`,
        `🗣️ Phon (RO): ${hoveredData.en_phonetic_ro || 'N/A'}`,
        `🔁 Synonyms: ${(hoveredData.synonyms || []).join(', ') || 'N/A'}`,
      ];
      tooltip.innerHTML = lines.join('<br>');
      tooltip.style.left = (e.pageX + 15) + 'px';
      tooltip.style.top = (e.pageY + 20) + 'px';
      tooltip.style.display = 'block';
    } else {
      tooltip.style.display = 'none';
    }
  });

  // ── 4. Persistence ─────────────────────────────────────────────
  function getStorageKeyForCurrentUrl() {
    const { hostname, pathname, search } = window.location;
    if (hostname.includes('youtube.com') && pathname.includes('/watch')) {
      const videoId = new URLSearchParams(search).get('v');
      if (videoId) {
        return `${URL_STORAGE_PREFIX}youtube-${videoId}`;
      }
    }
    return `${URL_STORAGE_PREFIX}${hostname}${pathname}`.replace(/[/.]/g, '-');
  }

  function saveState() {
    try {
      let dataToSave;
      if (currentStorageKey.startsWith(URL_STORAGE_PREFIX)) {
        dataToSave = {
          highlightPairs: highlightPairs,
          translations: Array.from(translationData.values())
        };
      } else {
        dataToSave = highlightPairs;
      }
      localStorage.setItem(currentStorageKey, JSON.stringify(dataToSave));
    } catch (e) {
      console.error("Failed to save state:", e);
      showToast("Error: Could not save highlights.", false);
    }
  }

  function loadAndRestoreState() {
    const urlKey = getStorageKeyForCurrentUrl();
    const urlSpecificData = localStorage.getItem(urlKey);
    let loadedSomething = false;

    if (urlSpecificData) {
      try {
        const parsedData = JSON.parse(urlSpecificData);
        if (parsedData && Array.isArray(parsedData.highlightPairs) && Array.isArray(parsedData.translations)) {
          highlightPairs = parsedData.highlightPairs;
          parsedData.translations.forEach(item => translationData.set(item.expression, item));
          currentStorageKey = urlKey;
          renderAllHighlights();
          showToast(`✅ Loaded ${highlightPairs.length} saved highlights for this page.`);
          loadedSomething = true;
        }
      } catch (e) { console.error("Failed to parse URL-specific highlights:", e); }
    }

    if (!loadedSomething) {
      const globalData = localStorage.getItem(GLOBAL_STORAGE_KEY);
      if (!globalData) return;
      try {
        const loadedPairs = JSON.parse(globalData);
        if (Array.isArray(loadedPairs)) {
          highlightPairs = loadedPairs;
          currentStorageKey = GLOBAL_STORAGE_KEY;
          renderAllHighlights();
        }
      } catch (e) { console.error("Failed to parse global highlights:", e); }
    }
  }

  // ── 5. User Feedback ───────────────────────────────────────────
  function showToast(message, isSuccess = true) {
    const existingToast = document.querySelector(`.${TOAST_CLASS}`);
    if (existingToast) existingToast.remove();
    const toast = document.createElement('div');
    toast.className = TOAST_CLASS;
    toast.textContent = message;
    toast.style.backgroundColor = isSuccess ? '#28a745' : '#dc3545';
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 500); }, 3000);
  }
  async function generateAndCopyPrompt() {
    if (highlightPairs.length === 0) return;
    const expressionsArray = JSON.stringify(highlightPairs, null, 2);
    const prompt = `For all the below English array of expressions, return a JSON array of objects with:\n- expression\n- definition\n- ro_translation\n- uk_pron\n- us_pron\n- synonyms\n- en_phonetic_ro (Romanian-style English pronunciation)\n\nLike\n[\n  {\n    "expression": "...",\n    "ro_translation": "...",\n    "definition": "...",\n    "uk_pron": "...",\n    "us_pron": "...",\n    "synonyms": ["...", ...],\n    "en_phonetic_ro": "..."\n  },\n...\n]\n\nArray of expressions:\n${expressionsArray}`;
    try {
      await navigator.clipboard.writeText(prompt);
      showToast(`✅ Prompt for ${highlightPairs.length} pair(s) copied to clipboard!`);
    } catch (err) {
      console.error('Failed to copy prompt: ', err);
      showToast('❌ Failed to copy prompt to clipboard.', false);
    }
  }

  // ── 6. Event Handlers ──────────────────────────────────────────
  document.addEventListener('keydown', (e) => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;

    const isCtrl = e.ctrlKey || e.metaKey;
    const isShift = e.shiftKey;
    const selectedText = selection.toString().trim();

    // Context: Ctrl + Up
    if (isCtrl && !isShift && e.key === 'ArrowUp') {
      e.preventDefault();
      lastContextText = selectedText;
      selection.removeAllRanges();
      renderAllHighlights();
      showToast('Yellow context set. Now highlight an expression.');
    }

    // Expression: Ctrl + Shift + Up
    if (isCtrl && isShift && e.key === 'ArrowUp') {
      e.preventDefault();
      const expressionText = selectedText;
      let contextText = lastContextText;

      if (!contextText) {
        const range = selection.getRangeAt(0);
        const blockContainer = range.commonAncestorContainer.parentElement?.closest('p, div, yt-formatted-string');
        if (blockContainer) {
          contextText = blockContainer.textContent.trim();
        } else {
          showToast('❌ Auto-context failed. Please set a context manually first.', false);
          return;
        }
      }

      highlightPairs.push({ context: contextText, expression: expressionText });
      lastContextText = null;
      selection.removeAllRanges();
      renderAllHighlights();
      saveState();
      generateAndCopyPrompt();
    }

    // Reset: Ctrl + Down
    if (isCtrl && !e.shiftKey && e.key === 'ArrowDown') {
      e.preventDefault();
      localStorage.removeItem(currentStorageKey);
      highlightPairs = [];
      lastContextText = null;
      translationData.clear();
      currentStorageKey = GLOBAL_STORAGE_KEY;
      renderAllHighlights();
      showToast('All highlights for this context cleared.');
    }
  });

  // ── 7. Global Functions & Styling ──────────────────────────────
  window.injectGPTTranslations = function(translationsArray) {
    if (!Array.isArray(translationsArray)) {
      alert('❌ Invalid input: Expected an array.');
      return;
    }
    translationsArray.forEach(item => {
      if (item.expression) {
        translationData.set(item.expression.trim(), item);
      }
    });
    currentStorageKey = getStorageKeyForCurrentUrl();
    saveState();
    showToast(`✅ Injected and saved ${translationsArray.length} translations for this page.`);
  };

  function addStyles() {
    const style = document.createElement('style');
    style.textContent = `
      ::highlight(${CONTEXT_HIGHLIGHT_NAME}) {
        background-color: #FFF380;
        color: inherit;
      }
      ::highlight(${EXPRESSION_HIGHLIGHT_NAME}) {
        background-color: #FFB266;
        color: inherit;
        cursor: help;
      }
      .${TOAST_CLASS} {
        position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
        padding: 12px 24px; border-radius: 8px; color: white;
        font-family: sans-serif; font-size: 16px; z-index: 999999;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        transition: opacity 0.5s ease-in-out; opacity: 1;
      }
    `;
    document.head.appendChild(style);
  }

  // ── 8. Bootstrap & Initialization ──────────────────────────────
  function bootstrap() {
    try {
      const transcriptButton = document.querySelectorAll("div.style-scope ytd-video-description-transcript-section-renderer yt-button-shape button")[1];
      if (transcriptButton && transcriptButton.getAttribute('aria-label') !== 'Close transcript') {
        transcriptButton.click();
      }
    } catch(e) { /* Ignore, transcript might already be open */ }
    setTimeout(loadAndRestoreState, 2000);
  }

  addStyles();
  if (window.trustedTypes && window.trustedTypes.createPolicy) {
    try{ window.trustedTypes.createPolicy('default', {
      createHTML: (string, sink) => string
    }); } catch (e){}
  }
  setTimeout(bootstrap, 1500);
})();
