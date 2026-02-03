# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Chrome extension (Manifest V3) that copies URLs of selected browser tabs to the clipboard in Markdown format. Clicking the extension icon generates a Markdown list of all highlighted tabs in the current window.

**Extension Name:** Copy URLs to Markdown
**Manifest Version:** 3

## Architecture

### Core Components

1. **background.js** - Service worker (background script)
   - Main entry point: `chrome.action.onClicked` listener
   - Queries highlighted tabs using `chrome.tabs.query({ highlighted: true, currentWindow: true })`
   - Generates Markdown formatted list: `- [title](url)`
   - Coordinates clipboard operations via Offscreen Document API
   - Shows temporary badge notification ("✓") for 1.5 seconds after copying

2. **offscreen.js + offscreen.html** - Offscreen Document for clipboard access
   - Manifest V3 service workers cannot access DOM or clipboard directly
   - Offscreen document receives `COPY_TO_CLIPBOARD` messages from background.js
   - Uses `document.execCommand('copy')` via hidden textarea element

3. **content.js** - Content script (injected on all URLs)
   - Listens for `COPY_SUCCESS` messages from background.js
   - Displays toast notification at top of page for 0.5 seconds

4. **manifest.json** - Extension configuration
   - Permissions: `tabs`, `clipboardWrite`, `scripting`, `activeTab`, `offscreen`
   - No popup - uses click handler instead

### Message Flow

```
User clicks icon → background.js → offscreen.js (clipboard) → background.js → content.js (toast)
```

### Key Implementation Details

**Markdown Escaping:**
`escapeMarkdown()` in background.js only escapes `[` and `]` characters to prevent link syntax issues in titles.

## Development

### Loading the Extension

1. Open `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked" and select this directory

### Testing

1. Select multiple tabs (Cmd+Click on macOS, Ctrl+Click on Windows)
2. Click the extension icon
3. Paste to verify Markdown format

### Icons

Located in `icons/` directory:
- Source: `icon-svg.svg`
- Required: 16x16, 48x48, 128x128 PNG

After modifying icons, reload the extension.

## Notes

- Codebase uses Japanese comments
- Works on chrome:// pages and incognito mode (per README)
