# Contributing to YouTube Transcript Highlighter

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## 🚀 Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/yourusername/youtube-transcript-highlight.git
   cd youtube-transcript-highlight
   ```
3. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 💻 Development

### Testing Your Changes

Since this is a browser script, testing involves:

1. **Manual Testing on YouTube**:
   - Open any YouTube video
   - Open browser console
   - Paste and run your modified `injector.js`
   - Test all keyboard shortcuts and features

2. **Cross-Browser Testing**:
   - Test in Chrome, Firefox, Safari, and Edge
   - Ensure CSS Highlight API works correctly
   - Verify localStorage persistence

3. **Feature Testing**:
   - Test highlighting functionality
   - Verify tooltip display
   - Check translation injection
   - Confirm per-video storage

### Code Style

- Use **ES6+** modern JavaScript
- Follow **2-space indentation**
- Use **camelCase** for variables and functions
- Add **comments** for complex logic
- Keep functions **focused and small**

### File Structure

```
youtube-transcript-highlight/
├── README.md           # Main documentation
├── injector.js         # Main script file
├── bookmarklet.js      # Minified bookmarklet version
├── package.json        # NPM package info
├── CONTRIBUTING.md     # This file
├── LICENSE            # MIT license
└── .gitignore         # Git ignore rules
```

## 🐛 Reporting Issues

When reporting bugs, please include:

1. **Browser and version**
2. **YouTube video URL** (if specific to a video)
3. **Steps to reproduce**
4. **Expected vs actual behavior**
5. **Console errors** (if any)
6. **Screenshots** (if helpful)

### Issue Template

```markdown
**Browser**: Chrome 91.0.4472.124
**OS**: Windows 10

**Steps to reproduce**:
1. Open YouTube video
2. Run injector script
3. Select text and press Ctrl+Up
4. ...

**Expected**: Text should be highlighted yellow
**Actual**: Nothing happens

**Console errors**: 
```
[Paste any console errors here]
```

**Additional context**: 
Any other relevant information
```

## ✨ Suggesting Features

We welcome feature suggestions! Please:

1. **Check existing issues** first
2. **Describe the feature** clearly
3. **Explain the use case**
4. **Consider implementation** complexity

### Feature Request Template

```markdown
**Feature**: Brief description

**Use case**: Why would this be useful?

**Implementation ideas**: Any thoughts on how this could work?

**Priority**: High/Medium/Low
```

## 📝 Pull Request Process

1. **Update documentation** if needed
2. **Test thoroughly** across browsers
3. **Write clear commit messages**:
   ```
   feat: Add support for custom highlight colors
   fix: Resolve tooltip positioning on mobile
   docs: Update installation instructions
   ```

4. **Create descriptive PR title and description**
5. **Link related issues** using "Fixes #123"

### PR Template

```markdown
## Changes
- Brief description of what changed
- Any breaking changes

## Testing
- [ ] Tested in Chrome
- [ ] Tested in Firefox  
- [ ] Tested on mobile
- [ ] Verified localStorage works

## Related Issues
Fixes #123
```

## 🏷️ Release Process

Releases follow semantic versioning:

- **Major** (1.0.0): Breaking changes
- **Minor** (0.1.0): New features
- **Patch** (0.0.1): Bug fixes

## 🤝 Code of Conduct

- Be **respectful** and **inclusive**
- **Help** newcomers and answer questions
- **Focus** on constructive feedback
- **Collaborate** openly and transparently

## 🎯 Areas for Contribution

### High Priority
- **Mobile browser support** improvements
- **Accessibility** enhancements
- **Performance** optimizations
- **Multi-language** support beyond Romanian

### Medium Priority
- **Visual customization** options
- **Export/import** functionality
- **Keyboard shortcut** customization
- **Integration** with other translation services

### Low Priority
- **Statistics** and analytics
- **Backup/sync** features
- **Advanced filtering** options

## 📚 Resources

- [CSS Highlight API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/CSS_Custom_Highlight_API)
- [YouTube DOM Structure](https://developers.google.com/youtube/iframe_api_reference)
- [Web Extensions API](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions)

## 💬 Getting Help

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and general discussion
- **Email**: [your-email] for sensitive matters

---

Thank you for contributing! 🎉
